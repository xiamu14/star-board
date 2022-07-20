import React, { useState, useCallback, useEffect } from "react";
import { db } from "../../database";
import { Repo } from "../../database/model/Repo";

import { convertTimestamp } from "../../utils/time";
import Pagination from "../pagination";
import Spinner from "../Spinner";

const limit = 30;

const filter = (it: Repo, keyword: string) => {
  return keyword
    ? it.name.includes(keyword) || it.description?.includes(keyword)
    : true;
};

interface Props {
  keyword: string;
}

const RepoTable = React.memo(({ keyword }: Props) => {
  const [visible, setVisible] = useState(false);
  const [list, setList] = useState<Repo[]>([]);
  const [total, setTotal] = useState(0);

  const getTableList = useCallback(
    async (params: {
      offset: number;
      orderBy?: string;
      searchWord?: string;
    }) => {
      const { offset, orderBy = "updatedAt", searchWord = "" } = params;
      setVisible(true);
      const total = await db.repos
        .filter((it) => filter(it, searchWord))
        .count();
      const data = await db.repos
        .orderBy(orderBy)
        .reverse() //DESC
        .filter((it) => filter(it, searchWord))
        .offset(offset)
        .limit(limit)
        .toArray();

      setTotal(total);
      setList(data);
      setVisible(false);
    },
    []
  );

  useEffect(() => {
    getTableList({ offset: 0, searchWord: keyword });
  }, [keyword]);

  const handleTurnPage = useCallback(
    async (_: number, offset: number) => {
      getTableList({ offset, searchWord: keyword });
    },
    [keyword]
  );

  return (
    <Spinner visible={visible}>
      <div className="overflow-x-auto w-full">
        <table className="table text-neutral table-zebra">
          <thead>
            <tr>
              <th className="index">#</th>
              <th className="name ">项目名</th>
              <th className="language">编程语言</th>
              <th className="description">描述</th>
              <th className="tags">标签</th>
              <th className="developer">开发者</th>
              <th className="updatedAt">更新日期</th>
            </tr>
          </thead>
          <tbody>
            {list.map((repo, index) => (
              <tr key={index}>
                <th className="index">{index + 1}</th>
                <td className="name">
                  <a
                    href={repo.htmlUrl}
                    className="link link-secondary"
                    target="_blank"
                  >
                    {repo.name}
                  </a>
                </td>

                <td className="language">{repo.language ?? "--"}</td>
                <td className="description">{repo.description}</td>
                <td className="tags">
                  {repo.topics.length === 0 ? "--" : ""}
                  {repo.topics.map((topic: string, index: number) => (
                    <div
                      key={index}
                      className="badge badge-outline mr-1 mb-1 !h-auto"
                    >
                      {topic}
                    </div>
                  ))}
                </td>
                <td className="developer">
                  <span>{repo.developer}</span>
                </td>
                <td className="updatedAt text-base-300">
                  {convertTimestamp("date", repo.updatedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end items-center pt-5 pb-10 px-10">
          <Pagination total={total} limit={limit} onTurnPage={handleTurnPage} />
        </div>
      </div>
    </Spinner>
  );
});

export default RepoTable;
