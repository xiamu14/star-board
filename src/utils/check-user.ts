const checkUser: (
  user: string
) => Promise<{ isValid: boolean; isCurrent: boolean }> = async (
  user: string
) => {
  const currentUser = localStorage.getItem("user");
  const response = await fetch(`https://api.github.com/users/${user}`);

  const data = await response.json();

  console.log(
    "%c response",
    "color:white;background: rgb(83,143,204);padding:4px",
    response
  );

  if ("id" in data) return { isValid: true, isCurrent: currentUser === user };

  return { isValid: false, isCurrent: false };
};

export default checkUser;
