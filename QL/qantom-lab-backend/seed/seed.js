// Populates MongoDB with the courses, testimonials, gallery items, FAQ and
// site settings that currently appear on the public site, so the admin
// panel (and the live site, which now reads from this data) starts out in
// sync with what visitors already see. Safe to re-run: it clears each
// collection first, so running it twice won't create duplicates.
//
// Usage:  npm run seed
require('dotenv').config();
const connectDB = require('../config/db');
const Course = require('../models/Course');
const Testimonial = require('../models/Testimonial');
const GalleryItem = require('../models/GalleryItem');
const Faq = require('../models/Faq');
const SiteSettings = require('../models/SiteSettings');

// category values match the public site's course filter bar exactly:
// ai | xr | engines | hardware | programming | webdesign | secdata
const courses = [
  { title: 'Artificial Intelligence', titleAr: 'الذكاء الاصطناعي', icon: '🤖', description: 'Machine learning foundations, deep learning and generative AI systems from first principles to production.', descriptionAr: 'أساسيات التعلم الآلي والتعلم العميق وأنظمة الذكاء الاصطناعي التوليدي من المبادئ الأولى إلى الإنتاج.', duration: '14 Weeks', durationAr: '14 أسبوع', difficulty: 'Advanced', category: 'ai', order: 1 },
  { title: 'Machine Learning', titleAr: 'التعلم الآلي', icon: '🧠', description: 'Supervised and unsupervised learning, model evaluation and real-world data pipelines that ship.', descriptionAr: 'التعلم الموجّه وغير الموجّه، وتقييم النماذج، ومسارات بيانات واقعية جاهزة للإنتاج.', duration: '12 Weeks', durationAr: '12 أسبوع', difficulty: 'Advanced', category: 'ai', order: 2 },
  { title: 'XR Development', titleAr: 'تطوير الواقع الممتد', icon: '🥽', description: 'Design cross-reality experiences that blend the physical and digital across every immersive platform.', descriptionAr: 'صمّم تجارب واقع متعدد تمزج بين المادي والرقمي عبر كل منصة غامرة.', duration: '10 Weeks', durationAr: '10 أسابيع', difficulty: 'Intermediate', category: 'xr', order: 3 },
  { title: 'VR Development', titleAr: 'تطوير الواقع الافتراضي', icon: '🕶️', description: 'Build fully immersive virtual worlds with real-time engines, spatial audio and 3D interaction systems.', descriptionAr: 'ابنِ عوالم افتراضية غامرة بالكامل باستخدام محركات الزمن الحقيقي والصوت المكاني وأنظمة التفاعل ثلاثية الأبعاد.', duration: '10 Weeks', durationAr: '10 أسابيع', difficulty: 'Intermediate', category: 'xr', order: 4 },
  { title: 'AR Development', titleAr: 'تطوير الواقع المعزز', icon: '📱', description: 'Overlay digital intelligence onto the real world with mobile AR, spatial tracking and marker recognition.', descriptionAr: 'أضِف ذكاءً رقميًا فوق العالم الحقيقي عبر الواقع المعزز على الجوال، وتتبع مكاني، والتعرف على العلامات.', duration: '8 Weeks', durationAr: '8 أسابيع', difficulty: 'Intermediate', category: 'xr', order: 5 },
  { title: 'Unity', titleAr: 'يونيتي', icon: '🎮', description: "Build cross-platform 2D and 3D games and interactive experiences with the industry's most-used engine.", descriptionAr: 'ابنِ ألعابًا وتجارب تفاعلية ثنائية وثلاثية الأبعاد عبر المنصات باستخدام المحرك الأكثر استخدامًا في الصناعة.', duration: '8 Weeks', durationAr: '8 أسابيع', difficulty: 'Beginner', category: 'engines', order: 6 },
  { title: 'Unreal Engine', titleAr: 'أنريل إنجن', icon: '🎬', description: 'Push AAA-grade visuals with Blueprints and C++ — lighting, physics and high-fidelity real-time rendering.', descriptionAr: 'حقق مرئيات بمستوى AAA باستخدام Blueprints وC++ — إضاءة وفيزياء وعرض عالي الدقة في الزمن الحقيقي.', duration: '10 Weeks', durationAr: '10 أسابيع', difficulty: 'Intermediate', category: 'engines', order: 7 },
  { title: 'Arduino', titleAr: 'أردوينو', icon: '🔌', description: 'Microcontroller programming, circuits and embedded systems — build real, physical, connected devices.', descriptionAr: 'برمجة المتحكمات الدقيقة والدوائر والأنظمة المدمجة — ابنِ أجهزة حقيقية ومتصلة.', duration: '6 Weeks', durationAr: '6 أسابيع', difficulty: 'Beginner', category: 'hardware', order: 8 },
  { title: 'Robotics', titleAr: 'الروبوتات', icon: '🦾', description: 'Design, build and program autonomous robots — sensors, actuators, kinematics and control systems.', descriptionAr: 'صمم وابنِ وبرمج روبوتات ذاتية الحركة — أجهزة استشعار، ومشغلات، وحركية، وأنظمة تحكم.', duration: '12 Weeks', durationAr: '12 أسبوع', difficulty: 'Advanced', category: 'hardware', order: 9 },
  { title: 'Python', titleAr: 'بايثون', icon: '🐍', description: 'The most versatile language in tech — scripting, automation, data and backend development.', descriptionAr: 'اللغة الأكثر مرونة في التقنية — البرمجة النصية والأتمتة والبيانات وتطوير الواجهة الخلفية.', duration: '8 Weeks', durationAr: '8 أسابيع', difficulty: 'Beginner', category: 'programming', order: 10 },
  { title: 'C#', titleAr: 'سي شارب', icon: '#️⃣', description: 'Object-oriented programming for games, apps and enterprise software built on the .NET ecosystem.', descriptionAr: 'برمجة كائنية التوجه للألعاب والتطبيقات والبرمجيات المؤسسية المبنية على منظومة .NET.', duration: '8 Weeks', durationAr: '8 أسابيع', difficulty: 'Beginner', category: 'programming', order: 11 },
  { title: 'C++', titleAr: 'سي بلس بلس', icon: '⚙️', description: 'High-performance programming for systems, engines and real-time applications where speed matters.', descriptionAr: 'برمجة عالية الأداء للأنظمة والمحركات والتطبيقات في الزمن الحقيقي حيث تُحسب كل ميلي ثانية.', duration: '10 Weeks', durationAr: '10 أسابيع', difficulty: 'Intermediate', category: 'programming', order: 12 },
  { title: 'Game Development', titleAr: 'تطوير الألعاب', icon: '🕹️', description: 'Game engines, 3D pipelines and gameplay systems — ship playable titles from concept to release.', descriptionAr: 'محركات الألعاب ومسارات ثلاثية الأبعاد وأنظمة اللعب — أطلق ألعابًا قابلة للعب من الفكرة إلى الإصدار.', duration: '12 Weeks', durationAr: '12 أسبوع', difficulty: 'Intermediate', category: 'engines', order: 13 },
  { title: 'Web Development', titleAr: 'تطوير الويب', icon: '🌐', description: 'Modern front-end and back-end craft — responsive interfaces, APIs and full-stack deployment.', descriptionAr: 'حرفية حديثة للواجهة الأمامية والخلفية — واجهات متجاوبة، وواجهات برمجية، ونشر متكامل.', duration: '10 Weeks', durationAr: '10 أسابيع', difficulty: 'Beginner', category: 'webdesign', order: 14 },
  { title: 'UI/UX Design', titleAr: 'تصميم واجهات وتجربة المستخدم', icon: '🎨', description: 'Design systems, wireframing and user research — craft interfaces people genuinely enjoy using.', descriptionAr: 'أنظمة تصميم، وتصميم أولي، وأبحاث المستخدم — صمّم واجهات يستمتع الناس فعليًا باستخدامها.', duration: '6 Weeks', durationAr: '6 أسابيع', difficulty: 'Beginner', category: 'webdesign', order: 15 },
  { title: 'Cyber Security', titleAr: 'الأمن السيبراني', icon: '🛡️', description: 'Threat modeling, network defense and ethical hacking — protect systems the way attackers think.', descriptionAr: 'نمذجة التهديدات، والدفاع عن الشبكات، والاختراق الأخلاقي — احمِ الأنظمة بعقلية المهاجم.', duration: '12 Weeks', durationAr: '12 أسبوع', difficulty: 'Advanced', category: 'secdata', order: 16 },
  { title: 'Data Science', titleAr: 'علم البيانات', icon: '📊', description: 'Statistics, visualization and predictive modeling — turn raw data into decisions that matter.', descriptionAr: 'الإحصاء والتصوير البياني والنمذجة التنبؤية — حوّل البيانات الخام إلى قرارات مهمة.', duration: '12 Weeks', durationAr: '12 أسبوع', difficulty: 'Advanced', category: 'secdata', order: 17 },
];

const testimonials = [
  { name: 'Rania Malik', role: 'Robotics Track Graduate', roleAr: 'خريجة مسار الروبوتات', quote: 'The Robotics and Arduino track completely changed how I approach engineering — labs felt like working at a real startup.', quoteAr: 'مسار الروبوتات والأردوينو غيّر تمامًا طريقتي في التعامل مع الهندسة — شعرت المختبرات وكأنني أعمل في شركة ناشئة حقيقية.', avatarInitials: 'RM', rating: 5, order: 1 },
  { name: 'Karim Taha', role: 'XR/VR Track Graduate', roleAr: 'خريج مسار الواقع الممتد والافتراضي', quote: 'I went from zero to shipping a VR prototype in twelve weeks. The mentorship here is unmatched.', quoteAr: 'انتقلت من الصفر إلى إطلاق نموذج أولي للواقع الافتراضي خلال اثني عشر أسبوعًا. الإرشاد هنا لا مثيل له.', avatarInitials: 'KT', rating: 5, order: 2 },
  { name: 'Sara Lund', role: 'AI Track Graduate', roleAr: 'خريجة مسار الذكاء الاصطناعي', quote: "Qantom Lab's AI program is as rigorous as any bootcamp I've seen — and the career support actually delivered.", quoteAr: 'برنامج الذكاء الاصطناعي في كوانتوم لاب صارم بقدر أي معسكر تدريبي رأيته — والدعم الوظيفي كان فعليًا مثمرًا.', avatarInitials: 'SL', rating: 5, order: 3 },
  { name: 'Daniel Osei', role: 'Game Development Graduate', roleAr: 'خريج تطوير الألعاب', quote: 'The Unity and Game Development track took my side-project idea and turned it into a real, finished game.', quoteAr: 'مسار يونيتي وتطوير الألعاب حوّل فكرة مشروعي الجانبي إلى لعبة حقيقية ومكتملة.', avatarInitials: 'DO', rating: 5, order: 4 },
  { name: 'Nadia Fares', role: 'Cyber Security Graduate', roleAr: 'خريجة الأمن السيبراني', quote: 'Cyber Security here is hands-on from day one — I was running real penetration tests within the first month.', quoteAr: 'الأمن السيبراني هنا عملي منذ اليوم الأول — كنت أجري اختبارات اختراق حقيقية خلال الشهر الأول.', avatarInitials: 'NF', rating: 5, order: 5 },
];

const galleryItems = [
  { title: 'AI Research Lab', titleAr: 'مختبر أبحاث الذكاء الاصطناعي', category: 'AI', description: 'Where our AI cohort trains models, tunes datasets and reviews real research papers together.', descriptionAr: 'حيث تدرّب دفعة الذكاء الاصطناعي النماذج، وتضبط مجموعات البيانات، وتراجع أوراقًا بحثية حقيقية معًا.', order: 1 },
  { title: 'Robotics Workshop', titleAr: 'ورشة الروبوتات', category: 'Robotics', description: 'Hands-on assembly, wiring and testing for our robotics and Arduino tracks.', descriptionAr: 'تجميع وتوصيل واختبار عملي لمساري الروبوتات والأردوينو.', order: 2 },
  { title: 'VR Studio Session', titleAr: 'جلسة استوديو الواقع الافتراضي', category: 'VR', description: 'Students building and testing immersive VR experiences in headsets.', descriptionAr: 'طلاب يبنون ويختبرون تجارب واقع افتراضي غامرة عبر النظارات.', order: 3 },
  { title: 'Hackathon Night', titleAr: 'ليلة الهاكاثون', category: 'Events', description: '48 hours, one team, one shipped project — our termly hackathon tradition.', descriptionAr: '48 ساعة، فريق واحد، مشروع واحد مكتمل — تقليد الهاكاثون الفصلي لدينا.', order: 4 },
  { title: 'Hardware Bench', titleAr: 'طاولة الأجهزة', category: 'Arduino', description: 'The bench where Arduino boards, sensors and prototypes come to life.', descriptionAr: 'الطاولة التي تنبض فيها لوحات الأردوينو وأجهزة الاستشعار والنماذج الأولية بالحياة.', order: 5 },
  { title: 'Graduation Day', titleAr: 'يوم التخرج', category: 'Events', description: 'Celebrating another cohort of Qantom Lab graduates and their portfolios.', descriptionAr: 'احتفال بدفعة جديدة من خريجي كوانتوم لاب وملفات أعمالهم.', order: 6 },
];

const faqs = [
  { topic: 'courses', order: 1, question: 'What courses does Qantom Lab offer?', questionAr: 'ما هي الدورات التي تقدمها كوانتوم لاب؟', answer: '17 courses across AI, XR/VR/AR, Unity, Unreal Engine, Arduino, Robotics, Python, C#, C++, Game Development, Web Development, UI/UX, Cyber Security and Data Science.', answerAr: '17 دورة في الذكاء الاصطناعي، والواقع الممتد/الافتراضي/المعزز، ويونيتي، وأنريل إنجن، والأردوينو، والروبوتات، وبايثون، وسي شارب، وسي بلس بلس، وتطوير الألعاب، وتطوير الويب، وتصميم واجهات المستخدم، والأمن السيبراني، وعلم البيانات.' },
  { topic: 'courses', order: 2, question: 'Do I need prior experience to start a course?', questionAr: 'هل أحتاج إلى خبرة سابقة لبدء دورة؟', answer: 'No prior experience is required for our foundational tracks. Each course starts from first principles, and applicants are placed into the right starting level after a short skills assessment.', answerAr: 'لا توجد حاجة لخبرة سابقة في مساراتنا التأسيسية. تبدأ كل دورة من المبادئ الأولى، ويتم تصنيف المتقدمين في المستوى المناسب بعد تقييم مهارات قصير.' },
  { topic: 'registration', order: 1, question: 'How do I register for a course?', questionAr: 'كيف أسجل في دورة؟', answer: 'Submit the contact form below with your course of interest, or email us directly. Our admissions team will follow up within 1–2 business days to confirm your seat.', answerAr: 'أرسل نموذج التواصل أدناه مع الدورة التي تهمك، أو راسلنا مباشرة. سيتابع فريق القبول خلال 1-2 يوم عمل لتأكيد مقعدك.' },
  { topic: 'registration', order: 2, question: 'Can I switch tracks after enrolling?', questionAr: 'هل يمكنني تغيير المسار بعد التسجيل؟', answer: 'Yes, within the first two weeks of a cohort you can switch tracks at no extra cost, subject to seat availability.', answerAr: 'نعم، خلال أول أسبوعين من الدفعة يمكنك تغيير المسار دون أي تكلفة إضافية، حسب توفر المقاعد.' },
  { topic: 'certificates', order: 1, question: 'Do I receive a certificate after graduating?', questionAr: 'هل أحصل على شهادة بعد التخرج؟', answer: 'Yes. Every graduate receives a Qantom Lab certification plus a reviewed project portfolio you can share with employers.', answerAr: 'نعم. يحصل كل خريج على شهادة معتمدة من كوانتوم لاب بالإضافة إلى ملف مشاريع تمت مراجعته يمكن مشاركته مع أصحاب العمل.' },
  { topic: 'certificates', order: 2, question: 'Are Qantom Lab certificates recognized by employers?', questionAr: 'هل شهادات كوانتوم لاب معترف بها من أصحاب العمل؟', answer: 'Our certificates are backed by a reviewed project portfolio and a hiring partner network, which is what employers weigh most alongside the credential itself.', answerAr: 'شهاداتنا مدعومة بملف مشاريع تمت مراجعته وشبكة شركاء توظيف، وهو ما يوليه أصحاب العمل أهمية أكبر إلى جانب الشهادة نفسها.' },
  { topic: 'schedule', order: 1, question: 'How long are the courses?', questionAr: 'كم مدة الدورات؟', answer: 'Most tracks run 10–14 weeks part-time, with intensive full-time options available that compress the same curriculum into 5–6 weeks.', answerAr: 'تمتد معظم المسارات من 10 إلى 14 أسبوعًا بدوام جزئي، مع خيارات مكثفة بدوام كامل تضغط المنهج نفسه إلى 5-6 أسابيع.' },
  { topic: 'schedule', order: 2, question: 'Are classes in-person, online, or both?', questionAr: 'هل الحصص حضورية أم عبر الإنترنت أم كلاهما؟', answer: 'Both. Hardware-heavy tracks like Robotics and Arduino are strongly recommended in-person for lab access, while AI, Programming and Game Development are available fully online with live mentor sessions.', answerAr: 'كلاهما. يُنصح بشدة بالحضور الشخصي لمسارات الأجهزة مثل الروبوتات والأردوينو للوصول إلى المختبر، بينما تتوفر مسارات الذكاء الاصطناعي والبرمجة وتطوير الألعاب بالكامل عبر الإنترنت مع جلسات إرشاد مباشرة.' },
  { topic: 'fees', order: 1, question: 'How much do courses cost?', questionAr: 'كم تكلفة الدورات؟', answer: 'Tuition varies by track and format — contact our admissions team for current pricing and any active cohort offers.', answerAr: 'تختلف الرسوم حسب المسار والصيغة — تواصل مع فريق القبول لمعرفة الأسعار الحالية وأي عروض نشطة للدفعة.' },
  { topic: 'fees', order: 2, question: 'Are payment plans available?', questionAr: 'هل تتوفر خطط دفع؟', answer: 'Yes, monthly installment plans are available for every track, along with need-based scholarships for eligible students.', answerAr: 'نعم، تتوفر خطط تقسيط شهرية لكل مسار، بالإضافة إلى منح دراسية حسب الحاجة للطلاب المؤهلين.' },
  { topic: 'online', order: 1, question: 'What do I need for online learning?', questionAr: 'ماذا أحتاج للتعلم عبر الإنترنت؟', answer: 'A laptop and stable internet connection are enough for most software tracks. Hardware tracks include a starter kit shipped to you as part of enrollment.', answerAr: 'حاسوب محمول واتصال إنترنت مستقر كافيان لمعظم المسارات البرمجية. تتضمن مسارات الأجهزة عدة بدء تُشحن إليك كجزء من التسجيل.' },
  { topic: 'online', order: 2, question: 'Is online learning as effective as in-person?', questionAr: 'هل التعلم عبر الإنترنت فعال بقدر الحضور الشخصي؟', answer: "Online cohorts follow the same curriculum with live mentor sessions, code/project reviews and career support — the format changes, the rigor doesn't.", answerAr: 'تتبع الدفعات عبر الإنترنت المنهج نفسه مع جلسات إرشاد مباشرة، ومراجعات للأكواد والمشاريع، ودعم وظيفي — الصيغة تتغير، لكن الصرامة لا تتغير.' },
];

const siteSettings = {
  contactEmail: 'quantomlap@gmail.com',
  contactPhone: '+962 7 8232 8748',
  whatsappNumber: '962782328748',
  whatsappMessage: 'Hello Quantum Lab, I would like to know more about your courses.',
  whatsappMessageAr: 'مرحبًا كوانتوم لاب، أرغب في معرفة المزيد عن دوراتكم.',
  social: { facebook: '', instagram: '', linkedin: '' },
  stats: { students: '500+', courses: '30+', projects: '20+', satisfaction: '95%' },
};

async function run() {
  await connectDB();

  await Course.deleteMany({});
  await Testimonial.deleteMany({});
  await GalleryItem.deleteMany({});
  await Faq.deleteMany({});
  await SiteSettings.deleteMany({});

  await Course.insertMany(courses);
  await Testimonial.insertMany(testimonials);
  await GalleryItem.insertMany(galleryItems);
  await Faq.insertMany(faqs);
  await SiteSettings.create(siteSettings);

  console.log(`[seed] Inserted ${courses.length} courses, ${testimonials.length} testimonials, ${galleryItems.length} gallery items, ${faqs.length} FAQ items, and default site settings.`);
  process.exit(0);
}

run().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
