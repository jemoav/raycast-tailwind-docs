import { useEffect, useState } from "react";
import axios from "axios";
import { LocalStorage } from "@raycast/api";
import DOCLIST from "./docList.json"
import { utilitiesParser } from "../utils/parser";

const DEVELOPMENT_MODE = process.env.NODE_ENV === "development"

type DocData = {
  title: string,
  markdown?: string
}

const GITHUB_DOC_URL = "https://raw.githubusercontent.com/tailwindlabs/tailwindcss.com/master/src/pages/docs/"

function getMarkdown(file: string) {
  return axios(GITHUB_DOC_URL + file).then(({ data }) => data).catch(() => 'No found');
}

export default function useGetDocs() {
  const [data, setData] = useState<DocData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const checkStorage = async () => {
    const dataStorage = await LocalStorage.getItem("tailwind-docs")

    if (!!dataStorage && typeof dataStorage === "string") {
      setData(JSON.parse(dataStorage))
      setIsLoading(false)
    } else {
      getDataFromUrl()
    }

  }

  const getDataFromUrl = async () => {
    const dataArray = await Promise.all(
      DOCLIST.map(async (file) => {
        const property = file.split(".mdx")[0]
        let data = await getMarkdown(file);

        data = utilitiesParser({ data, property })

        return {
          title: property,
          markdown: data || "",
        };
      })
    );

    await LocalStorage.setItem("tailwind-docs", JSON.stringify(dataArray))

    setData(dataArray)
    setIsLoading(false)
  }

  useEffect(() => {
    checkStorage()
  }, [])

  return { data, isLoading }
}