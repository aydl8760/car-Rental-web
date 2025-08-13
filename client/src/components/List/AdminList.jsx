"use client";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ListItem from "./ListItem";

export default function AdminList() {
  const { user } = useAuth();
  const [lists, setLists] = useState([]);

  console.log("User ID:", user?._id);

  useEffect(() => {
    const fetchList = async () => {
      const res = await axios.get(
        `http://localhost:8081/api/list/${user?._id}`,

        { withCredentials: true }
      );
      if (res) {
        console.log(res);
        setLists(res?.data);
      }
    };
    fetchList();
  }, [user?._id]);

  console.log(lists);

  return (
    <div className="grid grid-cols-3 gap-6">
      {lists?.length > 0 &&
        lists?.map((list) => (
          <div key={list?._id}>
            <ListItem list={list} />
          </div>
        ))}
    </div>
  );
}
