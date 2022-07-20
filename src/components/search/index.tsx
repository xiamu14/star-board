import React, { useState } from "react";

interface Props {
  onSearch: (keyword: string) => void;
}

const Search = React.memo(({ onSearch }: Props) => {
  const [value, setValue] = useState("");
  const handleSearch = () => {
    if (value) {
      onSearch(value);
    }
  };
  return (
    <div className="flex items-center">
      <input
        type="text"
        placeholder="关键词(项目名或描述)"
        className="input input-bordered w-full max-w-xs"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
      />
      <button
        className="ml-4 h-[2.8rem] w-[6rem] rounded-[6px] btn-primary"
        onClick={handleSearch}
      >
        搜 索
      </button>
    </div>
  );
});

export default Search;
