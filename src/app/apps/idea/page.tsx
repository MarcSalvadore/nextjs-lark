import * as React from "react";
import NextLink from 'next/link'; 
import Idea from "@/components/Apps/Idea/app";

export default function Page() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb-card">
        <h5>Idea</h5>

        <ul className="breadcrumb">
          <li>
            <NextLink href="/dashboard/ecommerce/">
              <i className="material-symbols-outlined">home</i>
              Dashboard
            </NextLink>
          </li>
          <li>Apps</li>
          <li>Idea</li>
        </ul>
      </div>

      <Idea />
    </>
  );
}
