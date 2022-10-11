import { useList, useMany, useOne, useShow } from "@pankod/refine-core";
import React from "react";

interface ICoupon {
  id: number;
  name: string;
}

export const CouponShow = () => {
  const { queryResult, showId } = useShow<ICoupon>({
    resource: "coupons",
    dataProviderName: "coupons",
  });
  return (
    <>
      <div>Coupon Detail</div>
      <pre>{JSON.stringify({ queryResult }, null, 2)}</pre>

      <div style={{ border: "1px solid #ccc", padding: "8px" }}>
        {queryResult.data && (
          <pre>{JSON.stringify(queryResult.data.data, null, 2)}</pre>
        )}
      </div>
    </>
  );
};
