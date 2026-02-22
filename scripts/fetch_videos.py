"""
fetch_videos.py
---------------
Consulta la API de YouTube Data v3, filtra los Shorts (<= 60 segundos)
y guarda los últimos vídeos largos en docs/videos.json.

Variables de entorno necesarias (GitHub Secrets):
  - YOUTUBE_API_KEY    → Tu clave de API de Google Cloud
  - YOUTUBE_CHANNEL_ID → ID del canal (empieza por UC...)
"""

import os
import json
import re
import urllib.request
from datetime import datetime

# --- CONFIG ---
API_KEY    = os.environ["YOUTUBE_API_KEY"]
CHANNEL_ID = os.environ["YOUTUBE_CHANNEL_ID"]
MAX_VIDEOS = 3    # Vídeos en el historial (sin contar el destacado)
FETCH_EXTRA = 20  # Cuántos vídeos pedir a la API para tener margen tras filtrar Shorts
OUTPUT     = "docs/videos.json"


def fetch(url):
    with urllib.request.urlopen(url) as r:
        return json.loads(r.read().decode())


def parse_duration_seconds(duration_str):
    """
    Convierte duración ISO 8601 (PT1M30S, PT45S, PT2H3M10S) a segundos.
    Los Shorts duran <= 60 segundos.
    """
    match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', duration_str)
    if not match:
        return 0
    hours   = int(match.group(1) or 0)
    minutes = int(match.group(2) or 0)
    seconds = int(match.group(3) or 0)
    return hours * 3600 + minutes * 60 + seconds


def get_video_durations(video_ids):
    """
    Consulta la duración de una lista de IDs de vídeo.
    Devuelve un dict {video_id: duracion_en_segundos}.
    """
    ids_str = ','.join(video_ids)
    url = (
        "https://www.googleapis.com/youtube/v3/videos"
        f"?part=contentDetails&id={ids_str}&key={API_KEY}"
    )
    data = fetch(url)
    durations = {}
    for item in data.get('items', []):
        vid_id   = item['id']
        duration = item['contentDetails']['duration']
        durations[vid_id] = parse_duration_seconds(duration)
    return durations


def main():
    # 1. Obtener la playlist "uploads" del canal
    channel_url = (
        "https://www.googleapis.com/youtube/v3/channels"
        f"?part=contentDetails&id={CHANNEL_ID}&key={API_KEY}"
    )
    channel_data = fetch(channel_url)
    uploads_playlist = (
        channel_data["items"][0]["contentDetails"]
        ["relatedPlaylists"]["uploads"]
    )

    # 2. Obtener los últimos vídeos de la playlist (pedimos más para poder filtrar)
    playlist_url = (
        "https://www.googleapis.com/youtube/v3/playlistItems"
        f"?part=snippet&playlistId={uploads_playlist}"
        f"&maxResults={FETCH_EXTRA}&key={API_KEY}"
    )
    playlist_data = fetch(playlist_url)
    items = playlist_data.get("items", [])

    # 3. Extraer IDs para consultar duraciones de golpe (1 sola llamada a la API)
    video_ids = [item["snippet"]["resourceId"]["videoId"] for item in items]
    durations = get_video_durations(video_ids)

    # 4. Filtrar Shorts (<= 60s) y construir lista final
    videos = []
    for item in items:
        snippet  = item["snippet"]
        video_id = snippet["resourceId"]["videoId"]
        duration = durations.get(video_id, 0)

        if duration <= 60:
            print(f"   ⏭️  Short ignorado ({duration}s): {snippet['title'][:55]}")
            continue

        title    = snippet["title"]
        date_raw = snippet["publishedAt"]
        dt       = datetime.fromisoformat(date_raw.replace("Z", "+00:00"))
        date_str = dt.strftime("%-d de %B de %Y").capitalize()

        videos.append({
            "id":        video_id,
            "title":     title,
            "date":      date_str,
            "duration":  duration,
            "thumbnail": f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg",
            "url":       f"https://www.youtube.com/watch?v={video_id}"
        })

        # Parar cuando tengamos suficientes (1 destacado + MAX_VIDEOS historial)
        if len(videos) >= MAX_VIDEOS + 1:
            break

    if not videos:
        print("⚠️  No se encontraron vídeos largos. Revisa el canal o aumenta FETCH_EXTRA.")
        return

    # 5. Guardar JSON
    output = {
        "updated":  datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "featured": videos[0],
        "history":  videos[1:]
    }

    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\n✅ videos.json actualizado — {len(videos)} vídeos largos guardados.")
    print(f"   Destacado : {output['featured']['title']}")
    for v in output["history"]:
        print(f"   Historial : {v['title']} ({v['duration']}s)")


if __name__ == "__main__":
    main()
