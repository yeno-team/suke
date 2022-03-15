import useAuth from "@suke/suke-web/src/hooks/useAuth";
import { Role } from "@suke/suke-core/src/Role";
import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Navigation } from "../../common/Navigation";
import { ITheaterItemSchedule, ScheduleState } from "@suke/suke-core/src/entities/TheaterItemSchedule";
import { ITheaterItem, TheaterCategory } from "@suke/suke-core/src/entities/TheaterItem";
import { createScheduleItem, createTheaterItem, deleteScheduleItem, deleteTheaterItem, editTheaterItem, getScheduleItems, getTheaterItems } from "@suke/suke-web/src/api/theater";
import Select from "react-select";
import { Checkbox } from "@suke/suke-web/src/components/Checkbox";
import { useSource } from "@suke/suke-web/src/hooks/useSource";
import { defaultNotificationOpts, useNotification } from "@suke/suke-web/src/hooks/useNotifications";
import { Button } from "@suke/suke-web/src/components/Button";
import { useLocale } from "@suke/suke-web/src/hooks/useLocale";
import DatePicker from "react-datepicker";
import Datetime from 'react-datetime';
import "react-datepicker/dist/react-datepicker.css";
import "react-datetime/css/react-datetime.css";
import classNames from "classnames";
import { VideoPlayer } from "@suke/suke-web/src/components/VideoPlayer";
import ReactPlayer from "react-player";
import { IVideoSource } from "@suke/suke-core/src/entities/SearchResult";
import { getUrlSources } from "@suke/suke-web/src/api/source";

const TheaterItem = ({item, onSubmit, sources, create, deleteCreateItem}: {item: ITheaterItem, onSubmit?: () => void, sources: string[], create?: boolean, deleteCreateItem?: () => void}) => {
    const [title, setTitle] = useState(item.title);
    const [posterUrl, setPosterUrl] = useState(item.posterUrl);
    const [category, setCategory] = useState(item.category);
    const [featured, setFeatured] = useState(item.featured);
    const [engine, setEngine] = useState(item.engine.toLowerCase());
    const [sourceUrl, setSourceUrl] = useState(item.sourceUrl);
    const [episode, setEpisode] = useState(item.episode);
    const [description, setDescription] = useState(item.description);
    const [featuredPictureUrl, setFeaturedPictureUrl] = useState(item.featuredPictureUrl);
    const [scheduleDate, setScheduleDate] = useState(new Date(Date.now()));
    const [duration, setDuration] = useState(item.duration);
    const [addScheduleVal, setAddScheduleVal] = useState(new Date(Date.now()));
    const notificationStore = useNotification();

    const [player, setPlayer] = useState<ReactPlayer | null | undefined>();

    const [videoSources, setVideoSources] = useState<IVideoSource[]>([]);
    const locale = useLocale();
    const localDuration = player?.getDuration() || duration;
    console.log(player?.getDuration());
    const categories = useMemo(() => {
        const keys = Object.keys(TheaterCategory).filter(v => isNaN(Number(v)));

        return keys.map((v) => ({
            value: v,
            label: TheaterCategory[v as keyof typeof TheaterCategory]
        }));
    }, []);

    const engines = useMemo(() => sources.map(v => ({
        value: v,
        label: v
    })), [sources]);

    const customStyles = {
        option: (provided: any, state: { isSelected: any; }) => ({
            ...provided,
            borderBottom: '1px dotted pink',
            color: state.isSelected ? 'black' : 'black',
            padding: 4
        }),
        control: (provided: any) => ({
            ...provided,
            padding: 0
        })
    }

    const submitChanges = async () => {
        try {
            await editTheaterItem(item.id, {
                title, posterUrl, category, featured, engine, sourceUrl, episode, description, featuredPictureUrl, duration: localDuration
            });
            onSubmit && onSubmit();
            return notificationStore.addNotification({
                ...defaultNotificationOpts,
                type : "success",
                title : "Success",
                message : "Changes Applied."
            });
        } catch (e) {
            return notificationStore.addNotification({
                ...defaultNotificationOpts,
                type : "danger",
                title : "Error",
                message : (e as Error).message
            });
        }
    }

    const deleteSchedule = async (id: number) => {
        try {
            await deleteScheduleItem(id);
            onSubmit && onSubmit();
            return notificationStore.addNotification({
                ...defaultNotificationOpts,
                type : "success",
                title : "Success",
                message : "Deleted Schedule."
            });
        } catch (e) {
            return notificationStore.addNotification({
                ...defaultNotificationOpts,
                type : "danger",
                title : "Error",
                message : (e as Error).message
            });
        }
    }

    const deleteItem = async () => {
        try {
            await deleteTheaterItem(item.id);
            onSubmit && onSubmit();
            notificationStore.addNotification({
                ...defaultNotificationOpts,
                type : "success",
                title : "Success",
                message : "Deleted."
            });
        } catch (e) {
            return notificationStore.addNotification({
                ...defaultNotificationOpts,
                type : "danger",
                title : "Error",
                message : (e as Error).message
            });
        }
    }

    const createSchedule = async () => {
        try {
            await createScheduleItem({
                time: addScheduleVal,
                state: ScheduleState.Waiting
            }, item.id);
            onSubmit && onSubmit();
            return notificationStore.addNotification({
                ...defaultNotificationOpts,
                type : "success",
                title : "Success",
                message : "Added Schedule."
            });
        } catch (e) {
            return notificationStore.addNotification({
                ...defaultNotificationOpts,
                type : "danger",
                title : "Error",
                message : (e as Error).message
            });
        }
    }

    const createForRestOfWeek = async () => {
        try {
            
            let currDate = addScheduleVal;
            let items = [];
            let passFirstDay = false;
            while (true) {
                currDate = new Date(currDate);
                if (currDate.getHours() + 3 >= 24) passFirstDay = true;
                currDate.setHours(currDate.getHours() + 3);
                if (passFirstDay && currDate.getDay() === 1) break;
                items.push({
                    item: {
                        time: currDate,
                        state: ScheduleState.Waiting
                    }
                });
            }

            await createScheduleItem({
                time: currDate,
                state: ScheduleState.Waiting
            }, item.id, items);
            onSubmit && onSubmit();
            return notificationStore.addNotification({
                ...defaultNotificationOpts,
                type : "success",
                title : "Success",
                message : "Added Schedule."
            });
        } catch (e) {
            return notificationStore.addNotification({
                ...defaultNotificationOpts,
                type : "danger",
                title : "Error",
                message : (e as Error).message
            });
        }
    }

    const createItem = async () => {
        try {
            await createTheaterItem({title, posterUrl, category, duration, featured, engine, sourceUrl, description, featuredPictureUrl});
            deleteCreateItem!();
            onSubmit && onSubmit();
            return notificationStore.addNotification({
                ...defaultNotificationOpts,
                type : "success",
                title : "Success",
                message : "Created Item."
            });
        } catch (e) {
            return notificationStore.addNotification({
                ...defaultNotificationOpts,
                type : "danger",
                title : "Error",
                message : (e as Error).message
            });
        }
    }

    const getDuration = () => {
        const sendRequest = async () => {
            try {
                const sources = await getUrlSources({engine: item.engine, url: new URL(item.sourceUrl)});
                setVideoSources && setVideoSources(sources);
            } catch (e) {
                console.error(e);
            }
        }
        sendRequest();
    }

    return (
        <div className={classNames("my-3  text-black p-4", create ? "bg-coolgray" : "bg-black")}>
            <h1 className="font-semibold text-white">Title</h1>
            <input value={title} onChange={e => setTitle(e.target.value)} className="p-2 rounded w-full bg-spaceblack text-lightgray"></input>
            <h1 className="font-semibold text-white mt-3">Poster Url</h1>
            <img src={posterUrl} className="w-40 mb-2" alt={"Movie Poster Of " + title}></img>
            <input value={posterUrl} onChange={e => setPosterUrl(e.target.value)} className="p-2 rounded w-full bg-spaceblack text-lightgray"></input>
            <h1 className="font-semibold text-white mt-3">Category</h1>
            <Select styles={customStyles} options={categories} className="w-3/12 mt-2" value={categories.find(v => v.label === category)!} onChange={(e) => setCategory(TheaterCategory[e!.value as keyof typeof TheaterCategory] as any)} ></Select>
            <div className="flex mt-4">
                <h1 className="font-semibold text-white mr-10">Featured</h1>
                <Checkbox active={featured} onClick={() => setFeatured(prev => !prev)}></Checkbox>
            </div>
            {
                featured && <React.Fragment>
                    <h1 className="font-semibold text-white mt-3">Description</h1>
                    <input value={description} onChange={e => setDescription(e.target.value)} className="p-2 rounded w-full bg-spaceblack text-lightgray"></input>
                    <h1 className="font-semibold text-white mt-3">Featured Picture Url</h1>
                    <input value={featuredPictureUrl} onChange={e => setFeaturedPictureUrl(e.target.value)} className="p-2 rounded w-full bg-spaceblack text-lightgray"></input>
                </React.Fragment>
            }
            <h1 className="font-semibold text-white mt-3">Engine</h1>
            <Select styles={customStyles} options={engines as any} className="w-3/12 mt-2" value={engines.find(v => v.label === engine)!} onChange={(e) => setEngine(e!.label)} ></Select>
            <h1 className="font-semibold text-white mt-3">Source Url</h1>
            <input value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} className="p-2 rounded w-full bg-spaceblack text-lightgray"></input>
            <h1 className="font-semibold text-white mt-3">Episode (optional)</h1>
            <input value={episode || undefined} onChange={e => setEpisode(Number(e.target.value))} className="p-2 rounded w-full bg-spaceblack text-lightgray"></input>
            <VideoPlayer ref={ref => setPlayer(ref)} sources={videoSources}></VideoPlayer>
            <h1 className="font-semibold text-reallywhite mt-6 text-lg">Local Duration (Press Get button and play the video and press Get again): {Math.round(localDuration/60)}m</h1>
            <Button className="py-1 font-semibold" onClick={getDuration}>Get Duration</Button>
            <div>
                <h1 className="font-semibold text-white mt-3">Schedules</h1>
                <DatePicker selected={scheduleDate} onChange={(date:Date) => setScheduleDate(date)} />
            </div>
            {
                item.schedules.filter(v => new Date(v.time).getDate() === scheduleDate.getDate() && new Date(v.time).getMonth() === scheduleDate.getMonth() && new Date(v.time).getFullYear() === scheduleDate.getFullYear()).map(v => <div key={v.id} className="bg-gray w-fit-content p-1 inline-block ml-0 m-1 text-center">
                    {new Date(v.time).toLocaleString(locale, { hour: 'numeric', minute: 'numeric', hour12: true })}
                    <span className="ml-2 text-brightRed text-sm font-black cursor-pointer" onClick={() => deleteSchedule(v.id)}>X</span>
                </div>)
            }
            <br />
            <h2 className="text-white">Add Schedule</h2>
            <Datetime className="mb-1" value={addScheduleVal} onChange={e=>setAddScheduleVal(new Date(e as string))}/>
            <Button className="h-7" onClick={createSchedule}>Add</Button>
            <Button className="h-7 ml-2" backgroundColor="green" onClick={createForRestOfWeek}>Add For Rest Of Week In 3 hour intervals</Button>
            <br />
            {
                create ? <Button className="mt-5 font-bold" backgroundColor="green" onClick={createItem}>Create Item</Button> :
                <Button className="mt-5 font-bold" backgroundColor="blue" onClick={submitChanges}>Submit Changes</Button>
            }
            
            <Button className="mt-5 font-bold ml-1" backgroundColor="red" onClick={() => create ? deleteCreateItem!() : deleteItem()}>Delete</Button>
        </div>
    )
}

export const ScheduleAdminPage = () => {
    const [schedules, setSchedules] = useState<ITheaterItemSchedule[]>([]);
    const [items, setItems] = useState<ITheaterItem[]>([]);
    const [createItems, setCreateItems] = useState<ITheaterItem[]>([]);
    const { sources } = useSource();
   
    
    async function fetchTheaterItems() {    
        try {
            setItems(await getTheaterItems());
            setSchedules(await getScheduleItems());
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        fetchTheaterItems();
    }, []);

    const { user } = useAuth();
    if (user == null || user.role !== Role.Admin) return <Navigate to="/" replace></Navigate>;
    return (
        <div className="bg-spaceblack text-white">
            <Navigation></Navigation>
            <div className="mx-10 my-5">
                <h1 className="text-xl font-semibold inline-block">Admin Panel: Theater</h1>
                <Button className="ml-4 inline-block" onClick={() => setCreateItems(prev => [{id: 0, title: "Default Title", viewerCount: 0, duration: 0, followers: [], posterUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALcAAAETCAMAAABDSmfhAAAAP1BMVEXo6Ojp6enn5+fd3d2ZmZmUlJTi4uKbm5u4uLjPz8+Tk5Pt7e2zs7O8vLzW1tbMzMympqbFxcWhoaHBwcGqqqpGcOzZAAAEkElEQVR4nO2di5LiIBBFIS+N5KGZ/P+3Lg15kJhY67h7wap7pmaMktocWeimMTWjuvwb6VSuv5Hceqvvg95Y6I2F3ljojYXeWOiNhd5Y6I2F3ljojYXeWOiNhd5Y6I2F3ljojYXeWOiNhd5Y6I2F3ljojYXeWOiNhd5Y6I2F3ljojYXeWOiNhd5Y6I2F3ljojYXeWOiNhd5Y6I2F3ljojYXeWOiNhd5Y6I2F3ljojYXeWOiNhd5Y6I2F3ljojYXeWOiN5VPvLGB9tnn59MW43moW0POD/Vr/ST03BM3zG/zguv+iv3X27i89rJSO39+6Hi9vMoy5tv9RUb3NT1m8TXnpdNxxonPRLoXZ6ZigVR4HHbe/tevu5to017t7B3d7eMB1cNbjfGIpIyWmd2MdeiPo0R625oTqblsf/rgpi7JOwLvyceVRFrdO7+O0j5WZaW2rm46Z6W9JeBeVHM3ek6z/mrKNnCjelWtNwVs5bx309y5Dqulb+/52h8l4q0PvxTkLxkla/S2HEsmdt8rU8wrF97eRoWMeaXiX10pkOxvqJu+DqSnecmKVqVxCS1xv5fq7GO6WSzF5B/NxmqJTfwcnxu5vF09WFu9wWroH771m+gTGyc47sA4ek/R2qzzvbbZhMNv0d3mZz0xhfJetluydz/NylV3V/bxsMpfyx+jeQd6x4S2M32onn1j81q/yzhRaVLre4frkoCqe1ye5i+4JeKuz/t4GlWxZn8hLKaxPFm/bjYu3WrWXYW6C9WAd3dvHk14vYaJVR0WDnuqGH3diFr9u8Hn+0lwto0so4/WYu2tdTkxinPx9XbwcWu8PLvuP5uUvSKi/y1fdvWmN7+3n5ZhXll7WHUNXHfOQ1rtrrYfo3j7P50a2L12k643b1dTTT7eLqbU8lSDSGTmUwiiF/n6Z59Uu72Sp5R31lOeV91Zr3tnk+Q8u+5/WVUEdv7yJFNdVPqFvvddx4vtbp+Xt4olMN21k5s31jnpaFbq6obYp36b6Nvq89PFkeHR1V1+DOk1te33yLoZeTmzjx+8579ws5a6+3EYUXxcvJ8b2Pqjnn5n3Y9PN83tvtdlHTifPz+O77vv6Wk77J2q/j6zmfYjLo7e0lzS8JZ5IoGiO9pHnQxdPegk8Opl48iLPL5Elsbxz7H1Q0ie2PjnyPvx4PrF8ebo+8aF7G08S8nbzMnc3Exg/81RwM8F6HWX8+lueyIZFbG+/XenqnXqtaA5w1dCYTL2j65tkE5d8ivVn8fShfdDq8k4V9XNue/HhF/cVyOfKke8/0flwO63hz7g16/02kbwzrer2ZI/qjLYzvoaL6W1LGbP5U6Dm4GjfnEX2fq5rdmuTV80xvSNBbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8sX+39jeSqe/evbiZB9wdLkUgm3FJ9/AAAAABJRU5ErkJggg==", description: "Description", featuredPictureUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALcAAAETCAMAAABDSmfhAAAAP1BMVEXo6Ojp6enn5+fd3d2ZmZmUlJTi4uKbm5u4uLjPz8+Tk5Pt7e2zs7O8vLzW1tbMzMympqbFxcWhoaHBwcGqqqpGcOzZAAAEkElEQVR4nO2di5LiIBBFIS+N5KGZ/P+3Lg15kJhY67h7wap7pmaMktocWeimMTWjuvwb6VSuv5Hceqvvg95Y6I2F3ljojYXeWOiNhd5Y6I2F3ljojYXeWOiNhd5Y6I2F3ljojYXeWOiNhd5Y6I2F3ljojYXeWOiNhd5Y6I2F3ljojYXeWOiNhd5Y6I2F3ljojYXeWOiNhd5Y6I2F3ljojYXeWOiNhd5Y6I2F3ljojYXeWOiNhd5Y6I2F3ljojYXeWOiN5VPvLGB9tnn59MW43moW0POD/Vr/ST03BM3zG/zguv+iv3X27i89rJSO39+6Hi9vMoy5tv9RUb3NT1m8TXnpdNxxonPRLoXZ6ZigVR4HHbe/tevu5to017t7B3d7eMB1cNbjfGIpIyWmd2MdeiPo0R625oTqblsf/rgpi7JOwLvyceVRFrdO7+O0j5WZaW2rm46Z6W9JeBeVHM3ek6z/mrKNnCjelWtNwVs5bx309y5Dqulb+/52h8l4q0PvxTkLxkla/S2HEsmdt8rU8wrF97eRoWMeaXiX10pkOxvqJu+DqSnecmKVqVxCS1xv5fq7GO6WSzF5B/NxmqJTfwcnxu5vF09WFu9wWroH771m+gTGyc47sA4ek/R2qzzvbbZhMNv0d3mZz0xhfJetluydz/NylV3V/bxsMpfyx+jeQd6x4S2M32onn1j81q/yzhRaVLre4frkoCqe1ye5i+4JeKuz/t4GlWxZn8hLKaxPFm/bjYu3WrWXYW6C9WAd3dvHk14vYaJVR0WDnuqGH3diFr9u8Hn+0lwto0so4/WYu2tdTkxinPx9XbwcWu8PLvuP5uUvSKi/y1fdvWmN7+3n5ZhXll7WHUNXHfOQ1rtrrYfo3j7P50a2L12k643b1dTTT7eLqbU8lSDSGTmUwiiF/n6Z59Uu72Sp5R31lOeV91Zr3tnk+Q8u+5/WVUEdv7yJFNdVPqFvvddx4vtbp+Xt4olMN21k5s31jnpaFbq6obYp36b6Nvq89PFkeHR1V1+DOk1te33yLoZeTmzjx+8579ws5a6+3EYUXxcvJ8b2Pqjnn5n3Y9PN83tvtdlHTifPz+O77vv6Wk77J2q/j6zmfYjLo7e0lzS8JZ5IoGiO9pHnQxdPegk8Opl48iLPL5Elsbxz7H1Q0ie2PjnyPvx4PrF8ebo+8aF7G08S8nbzMnc3Exg/81RwM8F6HWX8+lueyIZFbG+/XenqnXqtaA5w1dCYTL2j65tkE5d8ivVn8fShfdDq8k4V9XNue/HhF/cVyOfKke8/0flwO63hz7g16/02kbwzrer2ZI/qjLYzvoaL6W1LGbP5U6Dm4GjfnEX2fq5rdmuTV80xvSNBbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8sX+39jeSqe/evbiZB9wdLkUgm3FJ9/AAAAABJRU5ErkJggg==", category: TheaterCategory.everything, featured: false, engine: "anime 1", sourceUrl: "", schedules: []}])}>Add New Item</Button>
                {
                    createItems.map((v, i) => <TheaterItem deleteCreateItem={() => setCreateItems([])} sources={sources} key={83473734+i} item={v} onSubmit={fetchTheaterItems} create></TheaterItem>)
                }
                {
                    items.map(v => <TheaterItem sources={sources} key={v.id} item={v} onSubmit={fetchTheaterItems}></TheaterItem>)
                }
            </div>
            
        </div>
    )
};