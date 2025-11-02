import { TrackInfo } from '@/types/trackInfo';
import axios from 'axios';
import { getAccessToken } from './spotifyAuth';

export async function searchTrack(query: string): Promise<TrackInfo[]> {
  const token = await getAccessToken();

  const response = await axios.get('https://api.spotify.com/v1/search', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      q: query,
      type: 'track',
      limit: 5,
    },
  });

  const tracks = response.data.tracks.items;

  return tracks.map((track: any) => ({
    name: track.name,
    artist: track.artists[0]?.name || 'Unknown',
    albumImage: track.album.images[0]?.url || '',
    releaseYear: track.album.release_date?.slice(0, 4) || 'Unknown',
  }));
}
