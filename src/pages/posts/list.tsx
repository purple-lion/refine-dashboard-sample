import { useList, useMany } from "@pankod/refine-core";
import React from "react";

interface IPost {
  id: number;
  title: string;
  status: "rejected" | "published" | "draft";
}

export const PostList = () => {
  const data = useList<IPost>({
    resource: "posts",
    dataProviderName: "posts",
  });
  return (
    <>
      <div>PostList</div>
      <pre>{JSON.stringify({ data }, null, 2)}</pre>
    </>
  );
};
