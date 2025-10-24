import { useEffect, useState } from 'react';
import { Calendar, Car, Sparkles, Droplet, Home, Package, RefreshCw, Users } from 'lucide-react';

const PEOPLE = ['Colby', 'Jacob', 'Ryan', 'Caden'];
const CHORES = ['Kitchen', 'Bathroom', 'Floors', 'Shower'];

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function getNextSunday(date: Date): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + ((7 - result.getDay()) % 7 || 7));
  result.setHours(23, 59, 59, 999);
  return result;
}

function getParkingAssignments(weekNumber: number) {
  const baseOffset = (weekNumber * 3) % PEOPLE.length;
  return {
    friday: PEOPLE[baseOffset % PEOPLE.length],
    saturday: PEOPLE[(baseOffset + 1) % PEOPLE.length],
    sunday: PEOPLE[(baseOffset + 2) % PEOPLE.length],
  };
}

function getChoreAssignments(weekNumber: number) {
  const offset = weekNumber % PEOPLE.length;
  return CHORES.map((chore, index) => ({
    chore,
    person: PEOPLE[(offset + index) % PEOPLE.length],
  }));
}

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const weekNumber = getWeekNumber(currentDate);
  const parkingAssignments = getParkingAssignments(weekNumber);
  const choreAssignments = getChoreAssignments(weekNumber);
  const nextSunday = getNextSunday(currentDate);

  const getFridayDate = () => {
    const today = new Date(currentDate);
    const dayOfWeek = today.getDay();
    const daysUntilFriday = dayOfWeek <= 5 ? 5 - dayOfWeek : 5 + (7 - dayOfWeek);
    const friday = new Date(today);
    friday.setDate(today.getDate() + daysUntilFriday);
    return friday;
  };

  const friday = getFridayDate();
  const saturday = new Date(friday);
  saturday.setDate(friday.getDate() + 1);
  const sunday = new Date(friday);
  sunday.setDate(friday.getDate() + 2);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getWeekOfDate = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    return formatDate(startOfWeek);
  };

  const choreIcons = {
    Kitchen: Sparkles,
    Bathroom: Droplet,
    Floors: Home,
    Other: Package,
  };

  const choreColors = {
    Kitchen: 'from-emerald-400 to-emerald-500',
    Bathroom: 'from-sky-400 to-sky-500',
    Floors: 'from-purple-400 to-purple-500',
    Other: 'from-orange-400 to-orange-500',
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">House Schedule</h1>
          </div>
          <p className="text-gray-400 text-lg ml-16">
            {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <div className="flex items-center gap-2 mt-3 ml-16 text-gray-400">
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">Rotations update automatically every Sunday night</span>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 rounded-xl">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Parking Rotation</h2>
                <p className="text-sm text-gray-400">This week's spot assignments</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      F
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-white">Friday Night</div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(friday)}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900 px-5 py-2.5 rounded-xl text-white font-medium">
                    {parkingAssignments.friday}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      S
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-white">Saturday Night</div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(saturday)}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900 px-5 py-2.5 rounded-xl text-white font-medium">
                    {parkingAssignments.saturday}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      S
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-white">Sunday Night</div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(sunday)}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900 px-5 py-2.5 rounded-xl text-white font-medium">
                    {parkingAssignments.sunday}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2.5 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Weekly Chores</h2>
                <p className="text-sm text-gray-400">Week of {getWeekOfDate()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {choreAssignments.map(({ chore, person }) => {
                const Icon = choreIcons[chore as keyof typeof choreIcons];
                const colorClass = choreColors[chore as keyof typeof choreColors];
                return (
                  <div
                    key={chore}
                    className={`bg-gradient-to-br ${colorClass} rounded-2xl p-5 text-white`}
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="font-semibold text-lg">{chore}</div>
                    </div>
                    <div className="bg-white/90 px-4 py-2 rounded-lg text-gray-900 font-medium text-center">
                      {person}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800">
          <div className="flex items-center gap-3 mb-5">
            <Users className="w-6 h-6 text-gray-400" />
            <h3 className="text-xl font-bold text-white">Rotation Order</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {PEOPLE.map((person, index) => (
              <div
                key={person}
                className="bg-gray-800 border border-gray-700 rounded-xl px-5 py-3 flex items-center gap-3"
              >
                <div className="bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <span className="text-white font-medium">{person}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
