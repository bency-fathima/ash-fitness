import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store/hooks";
import { useEffect } from "react";
import {
  selectCategoryError,
  selectCategoryStatus,
  selectFounderCategories,
  selectTotalCategories,
} from "@/redux/features/category/category.selector";
import { getFounderCategories } from "@/redux/features/category/category.thunk";
import { CategoryListColumns } from "./CategoryListColumns";
import BaseTable from "@/components/table/BaseTable";
import { SyncLoader } from "react-spinners";


export default function CategoryTable() {
  const dispatch = useDispatch(); 
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  useEffect(() => {
    dispatch(getFounderCategories({ page, limit }));
  }, [dispatch, page, limit]);

    const data = useAppSelector(selectFounderCategories);
    const totalCount = useAppSelector(selectTotalCategories);
    const status = useAppSelector(selectCategoryStatus);
    const error = useAppSelector(selectCategoryError);

    const [ categories, setCategories] = useState([]);

    useEffect(()=>{
      setCategories(data);
    },[data])

  const searchInputHandler = (e) => {
    const value = e.target.value.toLowerCase();

    if (!value) {
      setCategories(data);
      return;
    }

    const filtered = data.filter((categories) =>
      categories.categoryName?.toLowerCase().includes(value),
    );

    setCategories(filtered);
  };


  if (status === "loading") return (
    <div className="flex justify-center items-center h-[calc(100vh-120px)]">
      <SyncLoader color="#9e5608" loading margin={2} size={20} />
    </div>
  );
  if (error) return <p className="text-red-500">{error}!</p>;
  return (
    <div className="h-[calc(100vh-130px)] pb-4 overflow-auto no-scrollbar">
      <BaseTable
        columns={CategoryListColumns()}
        data={categories}
        pageLabel={"Category List"}
        actionLabel="Add Category"
        actionPath="/founder/categories/add-category"
        onSearchInputChange={searchInputHandler}
        handlePageChange={setPage}
        handleLimitChange={setLimit}
        page={page}
        limit={limit}
        totalCount={totalCount}
      />
    </div>
  );
}
