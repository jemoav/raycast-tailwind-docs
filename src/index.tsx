import { ActionPanel, Detail, List, Action } from "@raycast/api"
import data from "./data2.json"

export default function Command() {
  return (
    <List>
      {data.map((item,index) => (
        <List.Item
        icon="tailwind.icon.png"
        title={item.title}
        subtitle={item.markdown}
        actions={
          <ActionPanel>
            <Action.Push title="Show Details" target={<Detail markdown={item.markdown} />} />
          </ActionPanel>
        }
      />
      ))}
    </List>
  );
}
