/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	Apartments = "apartments",
	Images = "images",
	PriceHistory = "price_history",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type ApartmentsRecord = {
	title?: string
	url?: string
	images?: RecordIdString[]
	screen_shot?: RecordIdString
	etuovi_id?: string
	floor?: string
	size?: string
	price_history?: RecordIdString[]
	price?: number
}

export type ImagesRecord = {
	single?: string
	set?: string[]
	apartment_id?: RecordIdString
}

export type PriceHistoryRecord = {
	apartment_id?: RecordIdString
	price?: number
}

export type UsersRecord = {
	name?: string
	avatar?: string
}

// Response types include system fields and match responses from the PocketBase API
export type ApartmentsResponse<Texpand = unknown> = ApartmentsRecord & BaseSystemFields<Texpand>
export type ImagesResponse<Texpand = unknown> = ImagesRecord & BaseSystemFields<Texpand>
export type PriceHistoryResponse<Texpand = unknown> = PriceHistoryRecord & BaseSystemFields<Texpand>
export type UsersResponse = UsersRecord & AuthSystemFields

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	apartments: ApartmentsRecord
	images: ImagesRecord
	price_history: PriceHistoryRecord
	users: UsersRecord
}

export type CollectionResponses = {
	apartments: ApartmentsResponse
	images: ImagesResponse
	price_history: PriceHistoryResponse
	users: UsersResponse
}