"""
fetch_videos.py
---------------
Consulta la API de YouTube Data v3 y guarda los últimos vídeos
del canal en /docs/videos.json para que el HTML los cargue dinámicamente.

Variables de entorno necesarias (configuradas como GitHub Secrets):
  - YOUTUBE_API_KEY   → Tu clave de API de Google Cloud
  - YOUTUBE_CHANNEL_ID → ID del canal (empieza por UC...)
"""

import os
import json
import urllib.request
import urllib.parse
from datetime import datetime

# --- CONFIG ---
API_KEY    = os.environ["YOUTUBE_API_KEY"]
CHANNEL_ID = os.environ["YOUTUBE_CHANNEL_ID"]
MAX_VIDEOS = 3   # Número de vídeos del historial
OUTPUT     = "docs/videos.json"   # Ruta del JSON de salida

def fetch(url):
    with urllib.request.urlopen(url) as r:
        return json.loads(r.read().decode())

def main():
    # 1. Obtener el ID de la playlist "uploads" del canal
    channel_url = (
        "https://www.googleapis.com/youtube/v3/channels"
        f"?part=contentDetails&id={CHANNEL_ID}&key={API_KEY}"
    )
    channel_data = fetch(channel_url)
    uploads_playlist = (
        channel_data["items"][0]["contentDetails"]
        ["relatedPlaylists"]["uploads"]
    )

    # 2. Obtener los últimos vídeos de esa playlist
    playlist_url = (
        "https://www.googleapis.com/youtube/v3/playlistItems"
        f"?part=snippet&playlistId={uploads_playlist}"
        f"&maxResults={MAX_VIDEOS + 1}&key={API_KEY}"  # +1 para el destacado
    )
    playlist_data = fetch(playlist_url)
    items = playlist_data.get("items", [])

    videos = []
    for item in items:
        snippet = item["snippet"]
        video_id = snippet["resourceId"]["videoId"]
        title    = snippet["title"]
        date_raw = snippet["publishedAt"]  # ISO 8601

        # Formatear fecha legible
        dt = datetime.fromisoformat(date_raw.replace("Z", "+00:00"))
        date_str = dt.strftime("%-d de %B de %Y").capitalize()

        videos.append({
            "id":    video_id,
            "title": title,
            "date":  date_str,
            "thumbnail": f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg",
            "url":   f"https://www.youtube.com/watch?v={video_id}"
        })

    # El primero es el vídeo destacado, el resto son el historial
    output = {
        "updated": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "featured": videos[0] if videos else None,
        "history":  videos[1:MAX_VIDEOS + 1] if len(videos) > 1 else []
    }

    # Guardar JSON
    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"✅ videos.json actualizado con {len(videos)} vídeos.")
    print(f"   Destacado: {output['featured']['title'] if output['featured'] else 'ninguno'}")
    for v in output["history"]:
        print(f"   Historial: {v['title']}")

if __name__ == "__main__":
    main()
