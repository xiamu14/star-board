import Spinner from "./components/Spinner";
import HeroBg from "./assets/hero-bg.png";
import { convertTimestamp } from "./utils/time";
import "./app.css";
import { db } from "./database";
import getRepos from "./utils/get-repos";
import Pagination from "./components/pagination";
import { useEffect, useState } from "react";
interface LangSelect {
  lang: string;
  count: number;
}

const limit = 30;

const App = () => {
  const [visible, setVisible] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [langSelects, setLangSelects] = useState<LangSelect[]>([]);
  useEffect(() => {
    const init = async () => {
      // NOTE: 同步数据
      let count = await db.repos.count();

      if (count === 0) {
        setVisible(true);
        const collection = await getRepos();
        count = collection.length;
        await db.repos.bulkAdd(collection);
        setVisible(false);
      }

      setTotal(count);

      // NOTE: 获取 第一页数据
      const data = await db.repos
        .orderBy("updatedAt")
        .offset(0)
        .limit(limit)
        .toArray();
      setList(data);

      db.repos.orderBy("language").uniqueKeys(async (languages) => {
        let list: LangSelect[] = [];
        const promises = languages.map(async (language) => {
          const count = await db.repos.where({ language }).count();

          return {
            lang: language.toString(),
            count,
          };
        });

        list = await Promise.all(promises);
        list.sort((a, b) => b.count - a.count);
        setLangSelects(list);
      });
    };
    init();
  }, []);

  const handleSyncRepos = async () => {
    setVisible(true);
    const collection = await getRepos();
    await db.repos.clear();
    await db.repos.bulkAdd(collection);
    setTotal(collection.length);
    // NOTE: 获取 第一页数据
    const data = await db.repos
      .orderBy("updatedAt")
      .offset(0)
      .limit(30)
      .toArray();
    setList(data);
    setVisible(false);
  };

  const handleTurnPage = async (_: number, offset: number) => {
    setVisible(true);
    const data = await db.repos
      .orderBy("updatedAt")
      .offset(offset)
      .limit(30)
      .toArray();
    setList(data);
    setVisible(false);
  };

  return (
    <div>
      <div className="hero bg-base-200 mb-6">
        <div className="flex-col w-full px-20 justify-between hero-content lg:flex-row-reverse">
          <img src={HeroBg} className="max-w-xs rounded-lg shadow-2xl" />
          <div>
            <h1 className="mb-5 text-5xl font-bold">Star Board</h1>
            <p className="mb-5">
              Star Board 是一个用于管理 Github 星标仓库的网页。<br></br>
              通过标签和编程语言分类星标仓库，从而实现快速查找星标仓库。
            </p>
            <button className="btn btn-primary" onClick={handleSyncRepos}>
              同步数据
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center max-w-[80em] px-20 flex-col m-auto">
        <div className="flex mb-4 w-full items-start">
          <div className="shadow stats mr-4">
            <div className="stat">
              <div className="stat-title">全部星标仓库</div>
              <div className="stat-value text-primary">{total}</div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="text"
              placeholder="关键词"
              className="input input-bordered w-full max-w-xs"
            />
            <button className="ml-4 h-[2.8rem] w-[6rem] rounded-[6px] btn-primary">
              搜 索
            </button>
          </div>
        </div>

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
                      {convertTimestamp("date", repo.updated_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end items-center pt-5 pb-10 px-10">
              <Pagination
                total={total}
                limit={limit}
                onTurnPage={handleTurnPage}
              />
            </div>
          </div>
        </Spinner>
      </div>
    </div>
  );
};

export default App;
