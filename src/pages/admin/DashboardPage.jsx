import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import StatCard from '../../components/admin/StatCard';
import ChartContainer from '../../components/admin/ChartContainer';

// MUI Icons
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import PeopleIcon from '@mui/icons-material/People';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MessageIcon from '@mui/icons-material/Message';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const DashboardPage = () => {
  const [propertyData, setPropertyData] = useState([]);
  const [pageViews, setPageViews] = useState({
    daily: [],
    total: 0
  });
  const [stats, setStats] = useState({
    properties: 0,
    users: 0,
    // Keeping mock data for now
    // Keeping mock data for now
  });
  const [registrations, setRegistrations] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  const forRent = propertyData.filter(property => property.status === 'for-rent');
  const forSale = propertyData.filter(property => property.status === 'for-sale');

  const rentPercentage = (forRent.length / propertyData.length) * 100;
  const salePercentage = (forSale.length / propertyData.length) * 100;

  const fetchStats = async () => {
    try {
      // Fetch properties count
      const propertiesSnapshot = await getDocs(collection(db, 'Properties'));
      setPropertyData(propertiesSnapshot.docs.map(doc => doc.data()));
      const propertiesCount = propertiesSnapshot.size;

      // Fetch users count
      const usersSnapshot = await getDocs(collection(db, 'Users'));
      setRegistrations(usersSnapshot.docs.map(doc => doc.data()))
      const usersCount = usersSnapshot.size;

      // Set both counts at once
      setStats(prev => ({
        ...prev,
        properties: propertiesCount,
        users: usersCount
      }));
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchPageViews = async () => {
    try {
      const viewsSnapshot = await getDocs(collection(db, 'PageViews'));
      const viewsData = viewsSnapshot.docs.map(doc => doc.data());

      // Calculate total views
      const totalViews = viewsData.reduce((total, view) => total + view.count, 0);

      // Get last 7 days of views
      const dailyViews = viewsData
        .sort((a, b) => b.date - a.date)
        .slice(0, 7)
        .reverse()
        .map(view => view.count);

      setPageViews({
        daily: dailyViews,
        total: totalViews
      });
    } catch (error) {
      console.error('Error fetching page views:', error);
    }
  };

  const fetchRegistrationsAndInquiries = async () => {
    try {

      const inquiriesSnapshot = await getDocs(collection(db, 'Inquiries'));

      const inquiriesData = inquiriesSnapshot.docs.map(doc => doc.data());


      setInquiries(inquiriesData);
    } catch (error) {
      console.error('Error fetching registrations and inquiries:', error);
    }
  };

  useEffect(() => {
    document.title = 'Admin Dashboard | RealEstate Hub';
    fetchStats();
    fetchPageViews();
    fetchRegistrationsAndInquiries();
  }, []);

  const renderBarChart = () => (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-full h-full flex items-end justify-around px-4">
        {pageViews.daily.map((views, index) => {
          const height = (views / Math.max(...pageViews.daily)) * 100;
          return (
            <div key={index} className="relative group" style={{ height: '100%' }}>
              <div
                className="w-8 bg-primary bg-opacity-80 rounded-t-md hover:bg-opacity-100 transition-all duration-200"
                style={{ height: `${height}%` }}
              ></div>
              <div className="absolute bottom-0 left-0 right-0 text-center mt-2 text-xs text-gray-600 dark:text-gray-400">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
              </div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {views}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderLineChart = () => {
    const registrationData = registrations.map(reg => reg.count);
    const inquiryData = inquiries.map(inq => inq.count);

    return (
      <div className="h-full w-full flex items-center">
        <svg viewBox="0 0 400 100" className="w-full h-full">
          <path
            d={`M0,${100 - registrationData[0]} Q50,${100 - registrationData[1]} 100,${100 - registrationData[2]} T200,${100 - registrationData[3]} T300,${100 - registrationData[4]} T400,${100 - registrationData[5]}`}
            fill="none"
            stroke="#3730A3"
            strokeWidth="3"
          />
          <path
            d={`M0,${100 - inquiryData[0]} Q50,${100 - inquiryData[1]} 100,${100 - inquiryData[2]} T200,${100 - inquiryData[3]} T300,${100 - inquiryData[4]} T400,${100 - inquiryData[5]}`}
            fill="none"
            stroke="#059669"
            strokeWidth="3"
          />
          <g>
            {registrationData.map((data, index) => (
              <circle key={index} cx={index * 100} cy={100 - data} r="3" fill="#3730A3" />
            ))}
          </g>
          <g>
            {inquiryData.map((data, index) => (
              <circle key={index} cx={index * 100} cy={100 - data} r="3" fill="#059669" />
            ))}
          </g>
        </svg>
      </div>
    );
  };

  const renderPieChart = () => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const rentOffset = circumference - (rentPercentage / 100) * circumference;
    const saleOffset = circumference - (salePercentage / 100) * circumference;

    return (
      <div className="h-full w-full flex items-center justify-center">
        <svg width="150" height="150" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#e2e8f0" strokeWidth="10" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#059669"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={rentOffset}
            transform="rotate(-90 50 50)"
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#3730A3"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={saleOffset}
            transform={`rotate(${-90 + (rentPercentage / 100) * 360} 50 50)`}
            strokeLinecap="round"
          />
          <text
            x="50"
            y="50"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#1f2937"
            className="dark:text-white"
          >
            100%
          </text>
        </svg>
        <div className="ml-8 space-y-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              For Sale {salePercentage.toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-secondary rounded-full mr-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              For Rent {rentPercentage.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back! Here's an overview of your platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <StatCard
          title="Total Properties"
          value={stats.properties.toString()}
          icon={<HomeWorkIcon className="text-blue-600 dark:text-blue-400" />}
          color="blue"
          percentChange={12.5}
          timeFrame="last month"
        />
        <StatCard
          title="Total Users"
          value={stats.users.toString()}
          icon={<PeopleIcon className="text-green-600 dark:text-green-400" />}
          color="green"
          percentChange={8.2}
          timeFrame="last month"
        />


      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">


        <ChartContainer title="User Registrations & Inquiries" filters={true}>
          {renderLineChart()}
        </ChartContainer>
        <ChartContainer title="Property Distribution">
          {renderPieChart()}
        </ChartContainer>
      </div>




    </div>
  );
};

export default DashboardPage;