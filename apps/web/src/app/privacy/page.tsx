import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description:
    "OKOJIN.LOG의 개인정보 수집·이용, 쿠키 및 Google AdSense 광고 관련 처리방침을 안내합니다.",
};

const CONTACT_EMAIL = "dswvgw1234@gmail.com";
const EFFECTIVE_DATE = "2026년 8월 1일";

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary font-bold underline underline-offset-4 hover:opacity-80 transition-opacity"
    >
      {children}
    </a>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-6 border-b border-border/50 pb-3">
        {title}
      </h2>
      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-foreground font-medium leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-center text-foreground mb-6 uppercase">
        Privacy
      </h1>
      <p className="text-center text-xs font-bold tracking-widest text-muted-foreground uppercase mb-16">
        시행일자 · {EFFECTIVE_DATE}
      </p>

      <div className="space-y-12">
        <Section title="개요">
          <p className="text-muted-foreground">
            OKOJIN.LOG(이하 &lsquo;사이트&rsquo;)는 이용자의 개인정보를 중요하게
            생각하며, 관련 법령을 준수합니다. 본 개인정보처리방침은 사이트가
            어떤 정보를 수집하고, 어떻게 이용하며, 광고 게재를 위해 어떤 쿠키가
            사용되는지를 안내합니다.
          </p>
        </Section>

        <Section title="수집하는 정보와 방법">
          <p className="text-muted-foreground">
            사이트는 회원가입 절차가 없으며, 이름·연락처 등 개인을 식별할 수
            있는 정보를 직접 수집하지 않습니다. 다만 서비스 이용 과정에서 아래
            정보가 자동으로 생성·수집될 수 있습니다.
          </p>
          <ul className="text-muted-foreground">
            <li>접속 IP 주소, 브라우저 및 운영체제 정보</li>
            <li>방문 일시, 방문한 페이지, 참조 URL 등 이용 기록</li>
            <li>쿠키(Cookie)를 통한 광고 및 이용 통계 데이터</li>
          </ul>
        </Section>

        <Section title="정보의 이용 목적">
          <p className="text-muted-foreground">
            수집된 정보는 다음 목적으로만 이용됩니다.
          </p>
          <ul className="text-muted-foreground">
            <li>서비스 안정성 확보 및 오류 개선</li>
            <li>이용 통계 분석을 통한 콘텐츠 품질 향상</li>
            <li>광고 게재 및 맞춤형 광고 제공</li>
          </ul>
        </Section>

        <Section title="쿠키(Cookie)의 사용">
          <p className="text-muted-foreground">
            사이트는 이용자 경험 향상과 광고 게재를 위해 쿠키를 사용합니다.
            쿠키는 이용자의 브라우저에 저장되는 작은 텍스트 파일입니다. 이용자는
            웹 브라우저 설정에서 쿠키 저장을 거부하거나 삭제할 수 있으며, 이
            경우 일부 기능 이용에 제한이 있을 수 있습니다.
          </p>
        </Section>

        <Section title="Google AdSense 및 제3자 광고">
          <p className="text-muted-foreground">
            사이트는 제3자 광고 사업자인 Google을 통해 광고를 게재합니다.
            Google을 포함한 제3자 광고 사업자는 쿠키(DoubleClick 쿠키 등)를
            사용하여 이용자의 이전 방문 기록을 바탕으로 맞춤형 광고를 제공할 수
            있습니다.
          </p>
          <ul className="text-muted-foreground">
            <li>
              Google이 광고 쿠키를 사용함으로써 이용자는 해당 사이트나 다른
              웹사이트의 방문 정보를 기반으로 한 광고를 제공받게 됩니다.
            </li>
            <li>
              이용자는{" "}
              <ExternalLink href="https://www.google.com/settings/ads">
                Google 광고 설정
              </ExternalLink>
              에서 맞춤 광고를 비활성화할 수 있습니다.
            </li>
            <li>
              또한{" "}
              <ExternalLink href="https://www.aboutads.info/choices/">
                www.aboutads.info
              </ExternalLink>
              를 통해 제3자 광고 사업자의 쿠키 사용을 거부할 수 있습니다.
            </li>
            <li>
              Google의 데이터 처리에 대한 자세한 내용은{" "}
              <ExternalLink href="https://policies.google.com/technologies/partner-sites">
                Google 광고 정책
              </ExternalLink>
              을 참고하시기 바랍니다.
            </li>
          </ul>
        </Section>

        <Section title="정보의 보유 및 이용 기간">
          <p className="text-muted-foreground">
            자동으로 수집된 접속 기록은 관련 법령이 정한 기간 또는 수집 목적이
            달성될 때까지 보유하며, 목적 달성 후에는 지체 없이 파기합니다.
            쿠키의 보유 기간은 각 쿠키의 설정에 따르며, 이용자가 브라우저에서
            직접 삭제할 수 있습니다.
          </p>
        </Section>

        <Section title="이용자의 권리">
          <p className="text-muted-foreground">
            이용자는 언제든지 브라우저 설정을 통해 쿠키 수집을 거부할 수 있으며,
            맞춤형 광고 수신을 거부할 수 있습니다. 개인정보와 관련한 문의 사항은
            아래 연락처로 요청하실 수 있습니다.
          </p>
        </Section>

        <Section title="문의처">
          <p className="text-muted-foreground">
            개인정보처리방침에 관한 문의는 아래 이메일로 연락 주시기 바랍니다.
          </p>
          <p>
            <ExternalLink href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </ExternalLink>
          </p>
        </Section>

        <Section title="고지의 의무">
          <p className="text-muted-foreground">
            본 개인정보처리방침의 내용이 변경되는 경우, 변경 사항을 본 페이지를
            통해 공지합니다. 최종 개정일은 상단의 시행일자를 기준으로 합니다.
          </p>
        </Section>
      </div>
    </div>
  );
}
