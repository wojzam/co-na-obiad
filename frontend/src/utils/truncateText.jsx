/**
 * Truncate a string and add an ellipsis if it exceeds the specified length.
 *
 * @param {string} text - The text to truncate.
 * @param {number} maxLength - The maximum length of the text before truncation.
 * @returns {string} - The truncated text with an ellipsis if necessary.
 */
const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) {
        return text;
    }
    return `${text.slice(0, maxLength)}...`;
};

export default truncateText;
