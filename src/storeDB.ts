import PocketBase from 'pocketbase';
import { randomUUID } from 'crypto';
import axios from 'axios';

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
    // store slide show images
    pb.autoCancellation(false)

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

    // store apartment record w/ associated images
    return await pb.collection('apartments').create({
        ...data,
        screen_shot: screenShot.id,
        images: imageIds
    })
}