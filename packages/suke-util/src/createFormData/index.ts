import FormData from "form-data";

export default function createFormData(data : Record<string, unknown>) : FormData {
    const formData = new FormData()

    for(const key in data) {
        formData.append(key , data[key])
    }

    return formData
}