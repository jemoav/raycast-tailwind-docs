import { ActionPanel, Detail, List, Action, LocalStorage, showToast, Toast } from "@raycast/api"
import useGetDocs from "./hooks/useGetDocs";

export default function Command() {
  const {data, isLoading} = useGetDocs()

  return (
    <List isLoading={isLoading}>
      {data.map((item, index) => (
        <List.Item
        key={index}
        icon="tailwind.icon.png"
        title={item.title}
        subtitle={item.title}
        actions={
          <ActionPanel>
            <Action.Push title="Show Details" target={<Detail markdown={item.markdown} />} />
              <Action
                title="Reset cached utilities"
                onAction={() => {
                  LocalStorage.removeItem("tailwind-docs")
                  showToast({
                    style: Toast.Style.Success,
                    title: 'Success',
                    message: 'Go back and open the extension again to refresh.'
                  })
                }}
              />
          </ActionPanel>

        }
      />
      ))}
    </List>
  );
}
