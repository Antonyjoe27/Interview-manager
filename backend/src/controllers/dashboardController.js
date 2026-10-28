import PreparationTask from '../models/PreparationTask.js';
import Interview from '../models/Interview.js';
import JobApplication from '../models/JobApplication.js';
import Note from '../models/Note.js';
import Resource from '../models/Resource.js';

function getLocalDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * @route   GET /api/dashboard/summary
 * @desc    Get aggregated dashboard metrics calculated from MongoDB collections
 */
export const getDashboardSummary = async (req, res, next) => {
  try {
    const today = getLocalDateString();

    // Run parallel queries across all five collections
    const [
      totalTasks,
      completedTasks,
      totalInterviews,
      upcomingInterviews,
      completedInterviews,
      pendingPrepInterviews,
      totalApplications,
      activeApplications,
      interviewingApplications,
      offersCount,
      rejectedApplications,
      withdrawnApplications,
      totalNotes,
      pinnedNotes,
      favoriteNotes,
      totalResources,
      favoriteResources
    ] = await Promise.all([
      // Tasks
      PreparationTask.countDocuments(),
      PreparationTask.countDocuments({ completed: true }),

      // Interviews
      Interview.countDocuments(),
      Interview.countDocuments({
        date: { $gte: today },
        status: { $in: ['Scheduled', 'Confirmed', 'Pending Preparation'] }
      }),
      Interview.countDocuments({ status: 'Completed' }),
      Interview.countDocuments({ status: 'Pending Preparation' }),

      // Applications
      JobApplication.countDocuments(),
      JobApplication.countDocuments({ status: { $nin: ['Rejected', 'Withdrawn'] } }),
      JobApplication.countDocuments({ status: 'Interview' }),
      JobApplication.countDocuments({ status: 'Offer' }),
      JobApplication.countDocuments({ status: 'Rejected' }),
      JobApplication.countDocuments({ status: 'Withdrawn' }),

      // Notes
      Note.countDocuments(),
      Note.countDocuments({ pinned: true }),
      Note.countDocuments({ favorite: true }),

      // Resources
      Resource.countDocuments(),
      Resource.countDocuments({ favorite: true })
    ]);

    const pendingTasks = totalTasks - completedTasks;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        tasks: {
          total: totalTasks,
          completed: completedTasks,
          pending: pendingTasks,
          completionPercentage
        },
        interviews: {
          total: totalInterviews,
          upcoming: upcomingInterviews,
          completed: completedInterviews,
          pendingPreparation: pendingPrepInterviews
        },
        applications: {
          total: totalApplications,
          active: activeApplications,
          interviewing: interviewingApplications,
          offers: offersCount,
          rejected: rejectedApplications,
          withdrawn: withdrawnApplications
        },
        library: {
          totalItems: totalNotes + totalResources,
          notes: {
            total: totalNotes,
            pinned: pinnedNotes,
            favorites: favoriteNotes
          },
          resources: {
            total: totalResources,
            favorites: favoriteResources
          },
          totalFavorites: favoriteNotes + favoriteResources
        },
        calculatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};
