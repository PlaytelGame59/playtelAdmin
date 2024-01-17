// /utils/service.js

import axios from "axios"

export const postRequest = async ({ url = null, data = null }) => {
    try {
        const response = await axios({
            method: 'post',
            url: url,
            data: data
        })

        return response.data

    } catch (e) {
        console.log(e)
        return null
    }
}

export const getRequest = async ({ url = null, data = null }) => {
    try {
        const response = await axios({
            method: 'get',
            url: url,
            data: data
        })

        return response.data

    } catch (e) {
        console.log(e)
        return null
    }
}