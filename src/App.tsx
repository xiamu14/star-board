import HeroBg from "./assets/hero-bg.png";
import "./app.css";
import { db } from "./database";
import getRepos from "./utils/get-repos";
import { useEffect, useMemo, useState } from "react";
import RepoTable from "./components/repo_table";
import Search from "./components/search";
import checkUser from "./utils/check-user";

const App = () => {
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");

  const [checkResult, setCheckResult] = useState<{
    isValid: boolean;
    isCurrent: boolean;
  }>();

  const user = useMemo(() => {
    const search = window.location.href.split("/");
    const user = search[search.length - 1];
    return user;
  }, []);

  useEffect(() => {
    const init = async () => {
      const result = await checkUser(user);

      console.log(
        "%c result",
        "background: #69c0ff; color: white; padding: 4px",
        result
      );

      setCheckResult(result);

      if (!result.isValid) return;

      localStorage.setItem("user", user);

      if (!result.isCurrent) return;

      // NOTE: 同步数据
      let count = await db.repos.count();

      if (count === 0) {
        const collection = await getRepos(user);
        count = collection.length;
        await db.repos.bulkAdd(collection);
      }
      setTotal(count);
    };
    init();
  }, []);

  const handleSyncRepos = async () => {
    const collection = await getRepos(user);
    await db.repos.clear();
    await db.repos.bulkAdd(collection);
    setCheckResult({ isValid: true, isCurrent: true });
    setTotal(collection.length);
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
            {checkResult?.isValid && (
              <button className="btn btn-primary" onClick={handleSyncRepos}>
                同步数据
              </button>
            )}
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

          <Search onSearch={setKeyword} />
        </div>

        <RepoTable keyword={keyword} checkResult={checkResult} />
      </div>
    </div>
  );
};

export default App;
