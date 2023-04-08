import PocketBase from 'pocketbase';
import { randomUUID } from 'crypto';
import axios from 'axios';
import { ApartmentsRecord, ApartmentsResponse, PriceHistoryRecord, PriceHistoryResponse } from './pocketbase-types';

const pb = new PocketBase('http://127.0.0.1:8090');

interface ApartmentData {
    title: string
    url: string
    images: string[]
    price: number | string
    screen_shot: Buffer
    etuovi_id: string
    floor: string,
    size: string
}

export const storeData = async (data: ApartmentData) => {
    // check if apartment exists
    const apartmentExists = await checkIfApartmentExists(data.etuovi_id)
    if (apartmentExists) {
        console.log('Apartment already exists')

        if ( apartmentExists.price !== data.price ) {
            console.log('Price has changed. Uploading old price to price history.')

            const oldPriceRecord = await pb.collection('price_history').create<PriceHistoryResponse>({
                apartment_id: apartmentExists.id,
                price: apartmentExists.price
            })

            await pb.collection('apartments').update<ApartmentsResponse>(apartmentExists.id, {
                price: data.price,
                price_history: [...(apartmentExists.price_history || []), oldPriceRecord.id]
            })
        }

        return        
    }

    const storeData = {
        ...data,
        imageIds: [],
    }

    // store apartment 
    const newApartment = await pb.collection('apartments').create<ApartmentsRecord>({
        title: data.title,
        url: data.url,
        price: data.price,
        etuovi_id: data.etuovi_id,
        floor: data.floor,
        size: data.size,
    })

    // store images

    let imageIds : string[] = []

    for (const image of data.images) {
        const formData = new FormData()
        const imageBuffer : Buffer = await axios.get(image, { responseType: 'arraybuffer' }).then(res => res.data)
        formData.append('single', new Blob([imageBuffer]) as Blob, randomUUID())

        const imageId = await pb.collection('images').create(formData)
        imageIds.push(imageId.id)
    }


    // store screenshot image
    const formData = new FormData()
    formData.append('single', new Blob([data.screen_shot]), randomUUID())

    const screenShot = await pb.collection('images').create(formData)

    console.log(imageIds)

    // update apartment with image ids
    await pb.collection('apartments').update<ApartmentsRecord>(newApartment.id, {screen_shot: screenShot.id, images: imageIds});
}

const checkIfApartmentExists = async (id: string)  => {
    try {
        const apartment = await pb.collection('apartments').getFirstListItem<ApartmentsResponse>(`etuovi_id="${id}"`)
        
        return apartment
    } catch (error) {
        console.log("error")
        return false
    }
}