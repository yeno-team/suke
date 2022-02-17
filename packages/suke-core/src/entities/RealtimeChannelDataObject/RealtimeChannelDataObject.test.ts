/**
 * Tests RealtimeRoomDataObject Class
 * 
 * @group unit/classes/RealtimeRoomDataObject
 */

import { RealtimeRoomDataObject } from ".";

describe('RealtimeRoomDataObject class', () => {
    describe('#Equals', () => {
        it('should return true if passed in matching objects', () => {
            const channel = new RealtimeRoomDataObject({
                id: 'test',
                title: 'test',
                category: 'test',
                viewerCount: 1,
                thumbnail: {url:""},
                currentVideo: {sources: [], name: 'test', thumbnail_url: 'test'},
                paused: false,
                progress: {currentTime: 0},
                private: true,
                password: '',
                followerOnlyChat: false,
                live: false
            });
            const channel2 = new RealtimeRoomDataObject({
                id: 'test',
                title: 'test',
                category: 'test',
                viewerCount: 1,
                thumbnail: {url:""},
                currentVideo: {sources: [], name: 'test', thumbnail_url: 'test'},
                paused: false,
                progress: {currentTime: 0},
                private: true,
                password: '',
                followerOnlyChat: false,
                live: false
            });

            expect(channel.Equals(channel2)).toBeTruthy();
        });

        it('should return false if passed in non-matching objects', () => {
            const channel = new RealtimeRoomDataObject({
                id: 'test',
                title: 'test',
                category: 'test',
                viewerCount: 1,
                thumbnail: {url:""},
                currentVideo: {sources: [], name: 'test', thumbnail_url: 'test'},
                paused: false,
                progress: {currentTime: 0},
                private: true,
                password: '',
                followerOnlyChat: false,
                live: false
            });
            const channel2 = new RealtimeRoomDataObject({
                id: 'test1',
                title: 'test',
                category: 'test',
                viewerCount: 1,
                thumbnail: {url:""},
                currentVideo: {sources: [], name: 'test3', thumbnail_url: 'test'},
                paused: false,
                progress: {currentTime: 1},
                private: true,
                password: '',
                followerOnlyChat: false,
                live: false
            });

            expect(channel.Equals(channel2)).toBeFalsy();

            const channel3 = new RealtimeRoomDataObject({
                id: 'test',
                title: 'test',
                category: 'test',
                viewerCount: 1,
                thumbnail: {url:""},
                currentVideo: {sources: [], name: 'test', thumbnail_url: 'test'},
                paused: false,
                progress: {currentTime: 0},
                private: true,
                password: '',
                followerOnlyChat: false,
                live: false
            });
            const channel4 = new RealtimeRoomDataObject({
                id: 'test',
                title: 'test',
                category: 'test',
                viewerCount: 1,
                thumbnail: {url:""},
                currentVideo: {sources: [], name: 'changed', thumbnail_url: 'test'},
                paused: false,
                progress: {currentTime: 0},
                private: true,
                password: '',
                followerOnlyChat: false,
                live: false
            });

            expect(channel3.Equals(channel4)).toBeFalsy();

            const channel5 = new RealtimeRoomDataObject({
                id: 'test',
                title: 'test',
                category: 'test',
                viewerCount: 1,
                thumbnail: {url:""},
                currentVideo: {sources: [], name: 'test', thumbnail_url: 'test'},
                paused: false,
                progress: {currentTime: 0},
                private: true,
                password: '',
                followerOnlyChat: false,
                live: false
            });
            const channel6 = new RealtimeRoomDataObject({
                id: 'test',
                title: 'test',
                category: 'test',
                viewerCount: 1,
                thumbnail: {url:"sup"},
                currentVideo: {sources: [], name: 'test', thumbnail_url: 'test'},
                paused: false,
                progress: {currentTime: 2},
                private: true,
                password: '',
                followerOnlyChat: false,
                live: false
            });

            expect(channel5.Equals(channel6)).toBeFalsy();
        });
    });
});