import { useList, useNavigation } from "@pankod/refine-core";

interface ICoupon {
  id: number;
  name: string;
}

export const CouponList = () => {
  const { show } = useNavigation();
  const data = useList<ICoupon>({
    resource: "coupons",
    dataProviderName: "coupons",
  });
  return (
    <>
      <div>CouponList</div>
      <pre>{JSON.stringify({ data }, null, 2)}</pre>
      {data.data?.data &&
        data.data.data.map((d) => (
          <div style={{ border: "1px solid #ccc", padding: "8px" }}>
            <pre>{JSON.stringify({ d }, null, 2)})</pre>
            <div>
              <a
                onClick={() => {
                  show("coupons", d.id);
                }}
              >
                {d.name}
              </a>
            </div>
          </div>
        ))}
    </>
  );
};
