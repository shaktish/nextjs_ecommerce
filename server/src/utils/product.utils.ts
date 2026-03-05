export const generateSku = ({
    brand, gender, category, size
}: {
    brand: string;
    gender: string;
    category: string;
    size: string;
}) => {
    return `${brand}-${gender}-${category}-${size}`
        .replace(/\s+/g, "")
        .toUpperCase();
};