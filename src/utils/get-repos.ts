import Matcher from "data-matcher";

export default async function getRepos() {
  const pagesize = 100;
  let current = 1;
  let repoList: any[] = [];
  async function getRepo() {
    const response = await fetch(
      `https://api.github.com/users/xiamu14/starred?page=${current}&per_page=${pagesize}`
    );
    const data = await response.json();
    repoList = repoList.concat(data);
    if (data.length === pagesize) {
      current += 1;
      await getRepo();
    } else {
      return true;
    }
  }
  await getRepo();
  console.log(
    "%c debug",
    "color:white;background: rgb(83,143,204);padding:4px",
    repoList
  );
  const matcher = new Matcher(repoList);
  matcher
    .pick([
      "id",
      "name",
      "language",
      "url",
      "archived",
      "description",
      "topics",
      "updated_at",
      "homepage",
      "html_url",
    ])
    .add("stared", () => true)
    .add("developer", (it) => {
      return it.full_name.split("/")[0];
    })
    .editKey({ id: "originId" })
    .editKey({ updated_at: "updatedAt" })
    .editKey({ html_url: "htmlUrl" });
  return matcher.data;
}
