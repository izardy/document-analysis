import { PagePadding } from "@/components/wrapper/PagePadding";

import { AdForms } from "../_components/AdForms";

const page = () => {
  return (
    <PagePadding>
      <h1 className="text-3xl font-bold">Advertisement Compliance Review</h1>
      <p className="mb-6 text-sm text-gray-600">
        Submit your marketing materials for compliance verification against Bank
        Negara Malaysia (BNM) and Shariah regulations. Please note that visual
        content requires manual review by our CARLS compliance team.
      </p>
      <AdForms />
    </PagePadding>
  );
};

export default page;
