const API_URL = "http://localhost:5000/api";

const fetchJson = async (endpoint, options = {}) => {
    const response = await fetch(`${API_URL}${endpoint}`, options);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new Error(
        errorData.message || `Request mislukt met status ${response.status}`
        );
    }

    return response.json();
};

export const getBases = () => fetchJson("/bases");

export const getFlavors = () => fetchJson("/flavors");

export const getToppings = () => fetchJson("/toppings");

export const createOrder = (orderData) =>
    fetchJson("/orders", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
    });