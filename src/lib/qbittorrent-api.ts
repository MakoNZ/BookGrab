import { getServerEnvVariables } from "./env";
import { TransmissionResponse } from "../types";

export async function addTorrent(
  torrentUrl: string,
  category: "audiobook" | "ebook",
): Promise<TransmissionResponse> {
  try {
    const {
      QB_HOST,
      QB_USERNAME,
      QB_PASSWORD,
      AUDIOBOOK_DESTINATION_PATH,
      EBOOK_DESTINATION_PATH,
    } = getServerEnvVariables();

    // Determine the download path based on category
    const downloadDir =
      category === "audiobook"
        ? AUDIOBOOK_DESTINATION_PATH
        : EBOOK_DESTINATION_PATH;

    const client = new QBittorrentClient(QB_HOST, QB_USERNAME, QB_PASSWORD);
    await client.login();
    await client.addMagnet(torrentUrl, downloadDir);

    return {
      success: true,
      message: "Torrent added successfully",
    };
  } catch (error) {
    console.error("Error adding torrent:", error);
    return {
      success: false,
      message: "Failed to add torrent",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

class QBittorrentClient {
  private baseUrl: string;
  private username: string;
  private password: string;
  private cookie: string | null = null;

  constructor(baseUrl: string, username: string, password: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.username = username;
    this.password = password;
  }

  async login(): Promise<void> {
    const resp = await fetch(`${this.baseUrl}/api/v2/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: this.username,
        password: this.password,
      }),
      credentials: "include",
    });

    if (!resp.ok) {
      throw new Error(`Login failed: ${resp.status} ${resp.statusText}`);
    }

    // Grab cookie for later requests
    const cookie = resp.headers.get("set-cookie");
    if (cookie) this.cookie = cookie;
  }

  async addMagnet(magnetUrl: string, savePath?: string): Promise<void> {
    const formData = new URLSearchParams();
    formData.append("urls", magnetUrl);
    if (savePath) {
      formData.append("savepath", savePath);
    }

    const headers: HeadersInit = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    if (this.cookie) {
      headers["Cookie"] = this.cookie;
    }

    const resp = await fetch(`${this.baseUrl}/api/v2/torrents/add`, {
      method: "POST",
      headers,
      body: formData.toString(),
      credentials: "include",
    });

    if (!resp.ok) {
      throw new Error(`Failed to add torrent: ${resp.status} ${resp.statusText}`);
    }
  }
}
