export interface CurseWidgetData {
    id: number
    title: string
    summary: string
    thumbnail: string
    downloads: CurseWidgetDownloads
    urls: CurseWidgetUrls
    members: CurseWidgetMember[]
}

export interface CurseWidgetDownloads {
    total: number
}

export interface CurseWidgetUrls {
    curseforge: string
}

export interface CurseWidgetMember {
    title: string
    username: string
}