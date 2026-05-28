// import { APP_CONFIG } from '@/core/configs';
// import { lang } from '@/core/libs';
// import { DashboardPageLayout } from '@/features/_global';
// import { ScheduleLandingContent } from '../containers';
// import { useSchedules } from '../hooks';
// import { useEffect, useState } from 'react';

// export const ScheduleLanding = () => {
//     const [dataError, setDataError] = useState<boolean>(false);

//     const schedules = useSchedules();
//     console.log('schedules:', schedules?.data)


//     const handleRefetch = () => {
//     schedules.query.refetch()
//     }

//     // Timeout for data undefined check
//     useEffect(() => {
//         if (schedules?.data === undefined) {
//         const timer = setTimeout(() => {
//             setDataError(true);
//         }, 60000); // 1 minute = 60,000ms
//         return () => clearTimeout(timer); // Cleanup on unmount or data change
//         } else {
//         setDataError(false); // Reset error if data becomes defined
//         }
//     }, [schedules?.data]);

//     // Early return if data is not available or loading
//     if (dataError) {
//         return (
//         <div className="w-full h-[400px] border-dashed border-black/10 rounded-md flex items-center justify-center text-center">
//             <p>Terjadi kesalahan saat pengambilan data!</p>
//         </div>
//         );
//     }

//     return (
//     <DashboardPageLayout
//         siteTitle={`${lang.text('scheduleMapel')} | ${APP_CONFIG.appName}`}
//         breadcrumbs={[
//         {
//             label: lang.text('scheduleMapel'),
//             url: '/schedules',
//         },
//         ]}
//         title={lang.text('scheduleMapel')}
//     >
//         {
//             !schedules || schedules.isLoading ? (
//                 <div className="w-full h-[400px] border-dashed border-black/10 rounded-md flex items-center justify-center text-center">
//                     <p>{lang.text("loadingScheduleMapel")}</p>
//                 </div>
//             ): (
//                 <ScheduleLandingContent schedule={() => handleRefetch()} data={[schedules?.data]} />
//             )
//         }
//         <div className="pb-16 sm:pb-0" />
//     </DashboardPageLayout>  
//     );
// };

import { APP_CONFIG } from '@/core/configs';
import { lang } from '@/core/libs';
import { DashboardPageLayout } from '@/features/_global';
import { ScheduleLandingContent } from '../containers';

export const ScheduleLanding = () => {
    return (
        <DashboardPageLayout
            siteTitle={`${lang.text('scheduleMapel')} | ${APP_CONFIG.appName}`}
            breadcrumbs={[
                {
                    label: lang.text('scheduleMapel'),
                    url: '/schedules',
                },
            ]}
            title={lang.text('scheduleMapel')}
        >
            <ScheduleLandingContent />
            <div className="pb-16 sm:pb-0" />
        </DashboardPageLayout>
    );
};