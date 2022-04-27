import _ from "lodash";
import TailwindUtilities from "../../utilities";

const SPECIAL_CASES = [{
    key: "accent-color",
    class: "accent"
},
{
    key: "align-items",
    class: "items",
    objectPosition: true
}]

const OBJECT_POSITIONS = ["auto", "start", "end", "center", "stretch", "baseline"]

type Props = {
    property: string,
    data: string
}

export const utilitiesParser = ({ property, data }: Props) => {
    const specialKey = SPECIAL_CASES.find(item => item.key === property)
    const utilityData = TailwindUtilities.theme[property] || TailwindUtilities.theme[_.camelCase(property)]
    const utilityDataType = typeof utilityData
    const utilityDataParsed = utilityDataType === "function" ? utilityData({ theme: () => { }, breakpoints: () => { } }) : utilityData

    if (utilityDataParsed && Object.keys(utilityDataParsed).length || specialKey?.objectPosition) {
        const initTable = "\n\n## Classes and properties\n\n```html"
        const endTable = "```\n\n"

        const properties = specialKey?.objectPosition ? OBJECT_POSITIONS : Object.keys(utilityDataParsed)
        const parseUtilities = properties.map(key => `\n${specialKey?.class || property}-${key} --------->  ${property}: ${utilityDataParsed?.[key] || key};\n`).join("")

        property == "align-items" && console.log("FIND", property, specialKey)

        data = initTable + parseUtilities + endTable + data
    }

    if (data.includes("title: ")) {
        data = data.replace("title: ", "# ")
    }
    if (data.includes("description: ")) {
        data = data.replace("description: ", "### ")
    }

    return data
}