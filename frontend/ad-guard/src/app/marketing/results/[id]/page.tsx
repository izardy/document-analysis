"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PagePadding } from "@/components/wrapper/PagePadding";

interface Application {
  id: string;
  campaign_name: string;
  target_audience: string;
  platform: string;
  caption: string;
  visual_descriptions: string;
  content: string;
  disclaimers?: string;
  classification: string;
  submittedDate: string;
  status: "Pending" | "Approved" | "Rejected";
}

// Dummy data with more details
const dummyData: Record<string, Application> = {
  "1": {
    id: "1",
    campaign_name: "Youth Savings Campaign 2024",
    target_audience: "Young professionals aged 25-35",
    platform: "instagram",
    caption:
      "Start your savings journey with our digital-first savings account",
    visual_descriptions:
      "Image shows a young professional using mobile banking app with vibrant colors and modern design. Graphics highlight key features: zero fees, high interest rates, and digital rewards.",
    content:
      "🌟 Introducing our new Digital Savings Account!\n\n✨ Zero maintenance fees\n💎 Up to 4% p.a. interest rate\n🎯 Exclusive digital rewards\n\nStart your savings journey today and unlock a world of digital banking benefits. Perfect for young professionals who want to grow their wealth effortlessly.",
    disclaimers:
      "Terms and conditions apply. Interest rates subject to change. Digital rewards program valid until December 2024.",
    classification: "New Product/Service",
    submittedDate: "2024-02-08",
    status: "Pending",
  },
  "2": {
    id: "2",
    campaign_name: "Ramadan Digital Banking Promo",
    target_audience: "Muslim customers aged 21-50",
    platform: "facebook",
    caption: "Experience seamless banking this Ramadan",
    visual_descriptions:
      "Ramadan-themed visuals with Islamic patterns, showing mobile banking interface. Features special Ramadan promotions and digital banking conveniences.",
    content:
      "Make your Ramadan banking easier with our digital services. Send money to loved ones, pay zakat, and manage your finances all from our app. Special Ramadan rewards for digital transactions.",
    disclaimers:
      "Promotion valid during Ramadan 2024 only. Subject to terms and conditions.",
    classification: "Campaign",
    submittedDate: "2024-02-07",
    status: "Approved",
  },
};

export default function ApplicationDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const application = dummyData[id];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getPlatformDisplay = (platform: string) => {
    const platformMap: Record<string, string> = {
      edm: "Electronic Direct Mail Marketing (eDM)",
      instagram: "Instagram",
      twitter: "Twitter/X",
      facebook: "Facebook",
      tiktok: "TikTok",
      youtube: "YouTube",
    };
    return platformMap[platform] || platform;
  };

  if (!application) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Application Not Found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <PagePadding>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Advertisement Review Details</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back to List
        </Button>
      </div>

      <div className="grid gap-6 rounded-lg bg-white p-6 shadow">
        {/* Header Information */}
        <div className="grid grid-cols-2 gap-4 border-b pb-4">
          <div>
            <h2 className="text-lg font-semibold">
              {application.campaign_name}
            </h2>
            <p className="text-gray-600">
              {getPlatformDisplay(application.platform)}
            </p>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(application.status)}`}
            >
              {application.status}
            </span>
            <p className="mt-1 text-gray-600">
              Submitted: {application.submittedDate}
            </p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid gap-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">Campaign Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Classification</p>
                <p className="font-medium">{application.classification}</p>
              </div>
              <div>
                <p className="text-gray-600">Target Audience</p>
                <p className="font-medium">{application.target_audience}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="grid gap-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">Caption</h3>
            <p className="rounded-lg bg-gray-50 p-3">{application.caption}</p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">Visual Descriptions</h3>
            <p className="whitespace-pre-wrap rounded-lg bg-gray-50 p-3">
              {application.visual_descriptions}
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">Content</h3>
            <p className="whitespace-pre-wrap rounded-lg bg-gray-50 p-3">
              {application.content}
            </p>
          </div>

          {application.disclaimers && (
            <div>
              <h3 className="mb-2 text-lg font-semibold">Disclaimers</h3>
              <p className="rounded-lg bg-gray-50 p-3">
                {application.disclaimers}
              </p>
            </div>
          )}
        </div>

        {/* Review Actions */}
        <div className="border-t pt-4">
          <div className="flex justify-end gap-3">
            <Button variant="outline" className="bg-red-50 hover:bg-red-100">
              Reject
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">Approve</Button>
          </div>
        </div>
      </div>
    </PagePadding>
  );
}
