export const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
};

export const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
};

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
};
