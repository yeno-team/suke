import { getRepository, LessThan, Repository } from 'typeorm';
import { ScheduleState, TheaterItemScheduleModel } from '@suke/suke-core/src/entities/TheaterItemSchedule';
import { RedisClient, RedisClientType } from '@suke/suke-server/src/config';
import Container from 'typedi';
import { RealtimeTheaterRoomData } from '@suke/suke-core/src/types/UserChannelRealtime';
import { parsers } from "@suke/parsers/src";
import { IVideoSource } from '@suke/suke-core/src/entities/SearchResult';
import { IStandaloneData } from "@suke/suke-core/src/entities/SearchResult";
import { IParser } from '@suke/suke-core/src/entities/Parser';
import { ScheduledTask } from '../ScheduledTask';

const getRoomKey = (id: number) => 'theater:rooms:' + id;

export class TheaterTask implements ScheduledTask {
    intervalTime: number = 7 * 1000;

    // How much time to give for the scheduler to find the source until it delays
    // private minDelayTime =  1 * (1000*60);
    private minDelayTime =  5 * (1000*60);
    
    // Time given until it cancels the scheduled time, from Delayed State.
    //private minCancelTime = 1 * (1000*60);
    private minCancelTime =  30 * (1000*60);

    // How much time to give users to join before starting the video
    private gracePeriod = 30 * 1000;
    // private gracePeriod = 15 * (60 * 1000);

    private redisClient!: RedisClient;
    private scheduleItemRepo!: Repository<TheaterItemScheduleModel>;

    async execute(): Promise<void> {
        this.redisClient = Container.get<RedisClientType>('redis');
        this.scheduleItemRepo = getRepository(TheaterItemScheduleModel );

        const now = new Date(Date.now());

        const itemsAvailable = await this.scheduleItemRepo.find({
            relations: ['item'],
            where: {
                time: LessThan(now)
            }
        });
        
        itemsAvailable.forEach(async item => {
            const key = getRoomKey(item.id);
            switch(item.state) {
                case ScheduleState.Waiting: {
                    console.log("WAITING");
                    const parser = parsers.find(v => v.name?.toLowerCase() === item.item.engine?.toLowerCase());
                    if (parser == null) return console.warn(`Parsers '${item.item.engine}' does not match any existing parser.`);

                    const foundSources = await findSources(parser, item);

                    if (foundSources == null || foundSources.length <= 0) {
                        // if source has not been grabbed and it has been over an {min} minutes then delay it
                        if (now.getTime() - item.time.getTime() > this.minDelayTime) {
                            item.state = ScheduleState.Delayed;
                            await item.save();
                            break;
                        }
                        break;
                    } 
                    
                    item.state = ScheduleState.Starting; 
                    this.createDefaultRoomData(item, foundSources, key);
                    await item.save();
                    break;
                }
                case ScheduleState.Delayed: {
                    console.log("DELAYED");
                    const parser = parsers.find(v => v.name?.toLowerCase() === item.item.engine?.toLowerCase());
                    if (parser == null) return console.warn(`Parsers '${item.item.engine}' does not match any existing parser.`);
                    
                    const foundSources = await findSources(parser, item);
                    if (foundSources == null || foundSources.length <= 0) {
                        // if source has not been grabbed and it has been over an hour then cancel it
                        if (Math.abs(now.getTime() - item.time.getTime()) > this.minDelayTime + this.minCancelTime) {
                            item.state = ScheduleState.Canceled;
                            await item.save();
                            console.log("CANCELED");
                        }
                        break;
                    } 

                    item.state = ScheduleState.Starting; 
                    await this.createDefaultRoomData(item, foundSources, key);
                    await item.save();
                    break;
                }
                case ScheduleState.Starting: {
                    console.log("STARTING");
                    const value: RealtimeTheaterRoomData = await this.getTheaterRoomData(key, item);
                    // start after 15 minutes
                    if (now.getTime() - item.time.getTime() >= this.gracePeriod) {
                        item.state = ScheduleState.Started;
                        value.live = true;
                        value.startedAt = new Date(Date.now()).getTime();
                        await this.redisClient.set(key, JSON.stringify(value));
                        await this.redisClient.publish("theater-live", JSON.stringify(value));
                        await item.save();
                    }
                    break;
                }
                case ScheduleState.Started: {
                    console.log("STARTED");
                    const value: RealtimeTheaterRoomData = await this.getTheaterRoomData(key, item);

                    // If video has ended
                    if (now.getTime() - item.time.getTime() >= (value.duration*1000)) {
                        value.live = false;
                        await this.redisClient.set(key, JSON.stringify(value));
                        await this.redisClient.publish("theater-end", JSON.stringify(value));
                        item.state = ScheduleState.Ended;
                        await item.save();
                    }

                    break;
                }
            }
        });
    }

    private async createDefaultRoomData(item: TheaterItemScheduleModel, foundSources: IVideoSource[], key: string) {
        const defaultData = await getDefaultTheaterRoomData(item, foundSources, this.gracePeriod);
        await this.redisClient.set(key, JSON.stringify(defaultData));
    }

    private async getTheaterRoomData(key: string, item: TheaterItemScheduleModel ): Promise<RealtimeTheaterRoomData> {
        const valueS: string = await this.redisClient.get(key) as string;
        let value: RealtimeTheaterRoomData;

        if (valueS == null) {
            const parser = parsers.find(v => v.name?.toLowerCase() === item.item.engine?.toLowerCase());
            const foundSources = await findSources(parser as IParser, item);
            const defaultData = await getDefaultTheaterRoomData(item, foundSources!, this.gracePeriod);
            await this.redisClient.set(key, JSON.stringify(defaultData));
            value = defaultData;
        } else {
            value = JSON.parse(valueS);
        }

        return value;
    }
}

const findSources = async (parser: IParser, item: TheaterItemScheduleModel ) => {
    const foundSources: IVideoSource[] = [];
    try {
        const data = await parser.getData(new URL(item.item.sourceUrl));
        if (data != null) {
            let sources: IVideoSource[] = [];

            if (item == null) return;
            if (item.item == null) return;
            if (data.multi && item.item.episode && data.data.data.length > (item.item.episode - 1)) {
                sources = data.data.data[item.item.episode - 1].sources;
            } else if (!data.multi) {
                sources = (data.data as IStandaloneData).sources;
            }
            
            for (const source of sources) {
                foundSources.push(...await parser.getSource(source.url));
            }
        }
    } catch (e) {
        console.warn("Error occured while grabbing source: ", e);
    }
    return foundSources;
};

const getDefaultTheaterRoomData = async (item: TheaterItemScheduleModel , foundSources: IVideoSource[], gracePeriodTime: number) => {
    return {
        id: item.id.toString(),
        title: item.item.title,
        category: item.item.category,
        viewerCount: 0,
        thumbnail: {
            url: item.item.posterUrl
        },
        currentVideo: {
            sources: foundSources,
            name: 'Video',
            thumbnail_url: item.item.posterUrl
        },
        progress: {currentTime: 0},
        paused: false,
        private: false,
        password: "",
        followerOnlyChat: false,
        live: false,
        duration: typeof item.item.duration == 'string' ? parseFloat(item.item.duration) : item.item.duration,
        startedAt: -gracePeriodTime
    };
};

