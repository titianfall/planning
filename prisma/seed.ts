import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const json = (value: string[]) => JSON.stringify(value);

const categories = [
  {
    slug: "software-engineering",
    name: "SW엔지니어",
    description: "웹, 서버, 플랫폼, 제품 개발 중심의 소프트웨어 직군입니다.",
    sortOrder: 1
  },
  {
    slug: "data-ai",
    name: "데이터/AI",
    description: "데이터 분석, 머신러닝, AI 제품화를 다루는 직군입니다.",
    sortOrder: 2
  },
];

const jobs = [
  {
    categorySlug: "software-engineering",
    slug: "backend-engineer",
    title: "백엔드 엔지니어",
    summary: "서비스의 API, 데이터 처리, 인증, 서버 안정성을 설계하고 구현합니다.",
    description:
      "백엔드 엔지니어는 사용자가 보지 못하는 서버 로직과 데이터 흐름을 책임집니다.\n\n- API와 데이터 모델 설계\n- 인증/권한, 결제, 알림 같은 핵심 기능 구현\n- 장애 대응과 성능 개선",
    skills: ["Java", "Spring", "SQL", "REST API", "System Design"],
    salaryEntryMin: 3200,
    salaryEntryMax: 5000,
    salarySeniorMin: 6000,
    salarySeniorMax: 10000,
    salaryNote: "회사 규모와 도메인에 따라 편차가 큽니다.",
    salarySourceUrl: "https://www.wanted.co.kr",
    salaryAsOfYear: 2026,
    entryDifficulty: "보통",
    interestAreas: ["서비스 구조", "데이터 흐름", "서버 안정성"],
    preferredStrengths: ["논리적 문제 해결", "꾸준한 디버깅", "구조화"],
    workStyles: ["팀 협업", "문서화", "운영 개선"],
    skillLevel: 4,
    collaborationLevel: 4,
    mathIntensity: 2,
    creativityLevel: 3,
    links: [
      ["jobBoard", "원티드 백엔드 채용", "https://www.wanted.co.kr/search?query=backend"],
      ["jobBoard", "점핏 백엔드 채용", "https://www.jumpit.co.kr/search?keyword=backend"],
      ["bootcamp", "우아한테크코스", "https://www.woowacourse.io"]
    ]
  },
  {
    categorySlug: "software-engineering",
    slug: "frontend-engineer",
    title: "프론트엔드 엔지니어",
    summary: "사용자가 직접 만지는 웹 화면과 상호작용을 빠르고 안정적으로 구현합니다.",
    description:
      "프론트엔드 엔지니어는 제품의 사용 경험을 코드로 구현합니다.\n\n- React 기반 UI 구현\n- 접근성, 반응형, 성능 최적화\n- 백엔드 API와 상태 관리 연결",
    skills: ["TypeScript", "React", "Next.js", "CSS", "Accessibility"],
    salaryEntryMin: 3000,
    salaryEntryMax: 4800,
    salarySeniorMin: 5500,
    salarySeniorMax: 9500,
    salaryNote: "제품 조직과 에이전시/SI 간 차이가 큽니다.",
    salarySourceUrl: "https://www.saramin.co.kr",
    salaryAsOfYear: 2026,
    entryDifficulty: "활발",
    interestAreas: ["사용자 경험", "웹 UI", "제품 개선"],
    preferredStrengths: ["디테일", "시각적 사고", "빠른 피드백 반영"],
    workStyles: ["디자이너 협업", "프로토타이핑", "사용성 개선"],
    skillLevel: 3,
    collaborationLevel: 5,
    mathIntensity: 1,
    creativityLevel: 4,
    links: [
      ["jobBoard", "원티드 프론트엔드 채용", "https://www.wanted.co.kr/search?query=frontend"],
      ["jobBoard", "프로그래머스 프론트엔드 채용", "https://career.programmers.co.kr/job?search=frontend"],
      ["bootcamp", "네이버 부스트캠프 웹모바일", "https://boostcamp.connect.or.kr"]
    ]
  },
  {
    categorySlug: "software-engineering",
    slug: "devops-engineer",
    title: "DevOps 엔지니어",
    summary: "배포, 모니터링, 자동화, 인프라 운영을 통해 서비스 개발 속도와 안정성을 높입니다.",
    description:
      "DevOps 엔지니어는 개발과 운영 사이의 반복 작업을 자동화합니다.\n\n- CI/CD 파이프라인 구축\n- 컨테이너와 클라우드 운영\n- 로그, 메트릭, 장애 대응 체계 개선",
    skills: ["Linux", "Docker", "Kubernetes", "CI/CD", "AWS"],
    salaryEntryMin: 3400,
    salaryEntryMax: 5200,
    salarySeniorMin: 6500,
    salarySeniorMax: 11000,
    salaryNote: "신입 채용은 많지 않지만 클라우드 경험이 있으면 강점이 됩니다.",
    salarySourceUrl: "https://www.jumpit.co.kr",
    salaryAsOfYear: 2026,
    entryDifficulty: "거의 없음",
    interestAreas: ["자동화", "인프라", "장애 대응"],
    preferredStrengths: ["꼼꼼함", "운영 감각", "시스템 사고"],
    workStyles: ["온콜 대응", "문서화", "반복 개선"],
    skillLevel: 5,
    collaborationLevel: 4,
    mathIntensity: 2,
    creativityLevel: 2,
    links: [
      ["jobBoard", "LinkedIn DevOps 검색", "https://www.linkedin.com/jobs/search/?keywords=DevOps%20Engineer"],
      ["bootcamp", "AWS Skill Builder", "https://skillbuilder.aws"]
    ]
  },
  {
    categorySlug: "data-ai",
    slug: "data-analyst",
    title: "데이터 분석가",
    summary: "비즈니스 질문을 데이터로 정의하고, 지표와 분석 결과를 통해 의사결정을 돕습니다.",
    description:
      "데이터 분석가는 문제를 수치화하고 설명 가능한 인사이트를 만듭니다.\n\n- SQL 기반 데이터 추출\n- 대시보드와 리포트 작성\n- 실험 결과 분석과 지표 설계",
    skills: ["SQL", "Python", "Statistics", "Tableau", "Business Metrics"],
    salaryEntryMin: 3000,
    salaryEntryMax: 4600,
    salarySeniorMin: 5200,
    salarySeniorMax: 8500,
    salaryNote: "도메인 이해와 커뮤니케이션 역량이 보상에 크게 영향을 줍니다.",
    salarySourceUrl: "https://www.wanted.co.kr",
    salaryAsOfYear: 2026,
    entryDifficulty: "보통",
    interestAreas: ["지표", "비즈니스", "실험 분석"],
    preferredStrengths: ["질문 설계", "커뮤니케이션", "숫자 감각"],
    workStyles: ["현업 협업", "리포팅", "가설 검증"],
    skillLevel: 3,
    collaborationLevel: 5,
    mathIntensity: 4,
    creativityLevel: 3,
    links: [
      ["jobBoard", "사람인 데이터 분석 채용", "https://www.saramin.co.kr/zf_user/search?searchword=%EB%8D%B0%EC%9D%B4%ED%84%B0%20%EB%B6%84%EC%84%9D"],
      ["bootcamp", "K-Digital Training", "https://www.hrd.go.kr"]
    ]
  },
  {
    categorySlug: "data-ai",
    slug: "machine-learning-engineer",
    title: "머신러닝 엔지니어",
    summary: "모델 학습, 평가, 서빙 파이프라인을 만들고 AI 기능을 제품에 연결합니다.",
    description:
      "머신러닝 엔지니어는 AI 모델을 실제 서비스에서 쓸 수 있게 만듭니다.\n\n- 데이터 전처리와 모델 학습\n- 모델 평가와 실험 관리\n- 추론 API, 배치 파이프라인 구축",
    skills: ["Python", "PyTorch", "ML Pipeline", "MLOps", "Linear Algebra"],
    salaryEntryMin: 3600,
    salaryEntryMax: 5600,
    salarySeniorMin: 7000,
    salarySeniorMax: 12000,
    salaryNote: "연구형 포지션과 제품형 포지션의 요구 역량이 다릅니다.",
    salarySourceUrl: "https://www.wanted.co.kr",
    salaryAsOfYear: 2026,
    entryDifficulty: "거의 없음",
    interestAreas: ["AI 모델", "수학", "제품화"],
    preferredStrengths: ["수학적 사고", "실험 설계", "끈기"],
    workStyles: ["연구와 구현 병행", "논문/문서 읽기", "성능 개선"],
    skillLevel: 5,
    collaborationLevel: 4,
    mathIntensity: 5,
    creativityLevel: 4,
    links: [
      ["jobBoard", "LinkedIn ML Engineer 검색", "https://www.linkedin.com/jobs/search/?keywords=Machine%20Learning%20Engineer"],
      ["bootcamp", "모두의연구소 AIFFEL", "https://aiffel.io"]
    ]
  },
  {
    categorySlug: "data-ai",
    slug: "data-engineer",
    title: "데이터 엔지니어",
    summary: "데이터가 안정적으로 수집, 저장, 처리되도록 파이프라인과 플랫폼을 구축합니다.",
    description:
      "데이터 엔지니어는 분석과 AI의 기반이 되는 데이터 흐름을 책임집니다.\n\n- ETL/ELT 파이프라인 구축\n- 데이터 웨어하우스와 스키마 관리\n- 배치/스트리밍 처리 안정화",
    skills: ["SQL", "Python", "Airflow", "Spark", "Data Warehouse"],
    salaryEntryMin: 3400,
    salaryEntryMax: 5200,
    salarySeniorMin: 6500,
    salarySeniorMax: 10500,
    salaryNote: "백엔드와 데이터 역량을 함께 요구하는 경우가 많습니다.",
    salarySourceUrl: "https://www.jumpit.co.kr",
    salaryAsOfYear: 2026,
    entryDifficulty: "보통",
    interestAreas: ["데이터 파이프라인", "대용량 처리", "플랫폼"],
    preferredStrengths: ["구조화", "운영 안정성", "SQL 감각"],
    workStyles: ["플랫폼 운영", "현업 지원", "장기적 개선"],
    skillLevel: 4,
    collaborationLevel: 4,
    mathIntensity: 3,
    creativityLevel: 2,
    links: [
      ["jobBoard", "원티드 데이터 엔지니어 채용", "https://www.wanted.co.kr/search?query=data%20engineer"]
    ]
  },
];

async function main() {
  await prisma.jobLink.deleteMany();
  await prisma.job.deleteMany();
  await prisma.category.deleteMany();

  const categoryBySlug = new Map<string, { id: string }>();

  for (const category of categories) {
    const created = await prisma.category.create({ data: category });
    categoryBySlug.set(category.slug, created);
  }

  for (const job of jobs) {
    const category = categoryBySlug.get(job.categorySlug);

    if (!category) {
      throw new Error(`Missing category for ${job.title}`);
    }

    const created = await prisma.job.create({
      data: {
        categoryId: category.id,
        slug: job.slug,
        title: job.title,
        summary: job.summary,
        description: job.description,
        skills: json(job.skills),
        salaryEntryMin: job.salaryEntryMin,
        salaryEntryMax: job.salaryEntryMax,
        salarySeniorMin: job.salarySeniorMin,
        salarySeniorMax: job.salarySeniorMax,
        salaryNote: job.salaryNote,
        salarySourceUrl: job.salarySourceUrl,
        salaryAsOfYear: job.salaryAsOfYear,
        entryDifficulty: job.entryDifficulty,
        interestAreas: json(job.interestAreas),
        preferredStrengths: json(job.preferredStrengths),
        workStyles: json(job.workStyles),
        skillLevel: job.skillLevel,
        collaborationLevel: job.collaborationLevel,
        mathIntensity: job.mathIntensity,
        creativityLevel: job.creativityLevel
      }
    });

    await prisma.jobLink.createMany({
      data: job.links.map(([type, label, url]) => ({
        jobId: created.id,
        type,
        label,
        url
      }))
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
