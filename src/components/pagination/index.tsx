import clsx from "clsx";
import { useCallback, useState } from "react";

interface Props {
  total: number;
  limit: number;
  onTurnPage?: (page: number, offset: number) => void;
}

const morePageLimit = 3;

const Pagination = ({ total, limit, onTurnPage }: Props) => {
  const [active, setActive] = useState(1);
  const [floatPage, setFloatPage] = useState(2);
  const totalPage = Math.ceil(total / limit);

  const pages = new Array(morePageLimit).fill(0).map((_, index) => {
    return floatPage + index;
  });

  const handleTurnPage = (page: number) => {
    if (page === 1) {
      setFloatPage(2);
    } else if (page === totalPage) {
      setFloatPage(totalPage - morePageLimit);
    }
    onTurnPage?.(page, (page - 1) * limit);
    setActive(page);
  };

  const handleMorePage = (type: "prev" | "next") => {
    const newFloatPage =
      type === "prev" ? active - morePageLimit : active + morePageLimit;
    onTurnPage?.(newFloatPage, (newFloatPage - 1) * limit);
    setActive(newFloatPage);
    setFloatPage(newFloatPage);
  };

  return (
    <div className="btn-group ml-4">
      <button className={clsx("btn btn-sm")}>«</button>
      <button
        className={clsx(`btn btn-sm`, { "btn-active": active === 1 })}
        onClick={() => handleTurnPage(1)}
      >
        1
      </button>
      {floatPage > 2 && (
        <button className="btn btn-sm" onClick={() => handleMorePage("prev")}>
          ...
        </button>
      )}
      {pages.map((page) => {
        return (
          <button
            key={page}
            className={clsx(`btn btn-sm`, { "btn-active": active === page })}
            onClick={() => handleTurnPage(page)}
          >
            {page}
          </button>
        );
      })}
      {floatPage < totalPage - 3 && (
        <button className="btn btn-sm" onClick={() => handleMorePage("next")}>
          ...
        </button>
      )}

      <button
        className={clsx(`btn btn-sm`, {
          "btn-active": active === totalPage,
        })}
        onClick={() => handleTurnPage(totalPage)}
      >
        {totalPage}
      </button>

      <button className={clsx("btn btn-sm")}>»</button>
    </div>
  );
};

export default Pagination;
