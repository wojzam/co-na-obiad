export const formatFraction = (text) => {
    if (!text) return "";
    const regex = /(\d+)\/(\d+)/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
        if (index % 3 === 0) {
            return part;
        } else if ((index + 2) % 3 === 0) {
            const numerator = part;
            const denominator = parts[index + 1];
            return (
                <span key={index}>
                    <sup>{numerator}</sup>/<sub>{denominator}</sub>
                </span>
            );
        } else {
            return "";
        }
    });
};