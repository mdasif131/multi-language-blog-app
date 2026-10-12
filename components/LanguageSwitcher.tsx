"use client";

import { usePathname, useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
 
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPathname = segments.join("/");

    router.push(newPathname);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="lang-select" className="text-sm font-medium">Language:</label>
      <select 
        id="lang-select"
        onChange={handleLanguageChange}
        defaultValue={pathname.split("/")[1]}
        className="border rounded px-2 py-1 text-sm bg-white"
      >
        <option value="en">English (EN)</option>
        <option value="bn">বাংলা (BN)</option>
        <option value="hi">हिन्दी (HI)</option>
        <option value="ar">العربية (AR)</option>
        <option value="ja">日本語 (JA)</option>
        <option value="ko">한국어 (KO)</option>
        <option value="en-SG">English (SG)</option>
      </select>
    </div>
  );
}