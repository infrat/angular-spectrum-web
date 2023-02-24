module.exports = async (targetOptions, indexHtmlContent) => {
    indexHtmlContent = indexHtmlContent.replaceAll("type=\"module\"", "");
    console.log(indexHtmlContent);
    return indexHtmlContent;
}