'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Gift, DollarSign, Award } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AnalyticsType } from '@/types/analytics-type';

export function Analytics({
  numberOfGiftsPurchased,
  numberOfGiftsRedeemed,
  numberofPoints,
}: AnalyticsType) {
  const data = [
    {
      date: 'Jan 2023',
      purchased: 2,
      redeemed: 1,
    },
    {
      date: 'Feb 2023',
      purchased: 4,
      redeemed: 2,
    },
    {
      date: 'Mar 2023',
      purchased: 5,
      redeemed: 3,
    },
    {
      date: 'Apr 2023',
      purchased: 3,
      redeemed: 4,
    },
    {
      date: 'May 2023',
      purchased: 6,
      redeemed: 3,
    },
    {
      date: 'Jun 2023',
      purchased: 8,
      redeemed: 5,
    },
  ];

  const valueData = [
    { date: 'Jan 2023', value: 200 },
    { date: 'Feb 2023', value: 450 },
    { date: 'Mar 2023', value: 580 },
    { date: 'Apr 2023', value: 320 },
    { date: 'May 2023', value: 680 },
    { date: 'Jun 2023', value: 920 },
  ];

  return (
    <div className='space-y-6'>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='bg-card border border-purple-800/30'>
          <CardHeader className='pb-2'>
            <CardDescription>Total Gifts Purchased</CardDescription>
            <CardTitle className='text-2xl font-bold'>
              {numberOfGiftsPurchased}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-muted-foreground'>
                +12.5% from last month
              </div>
              <Gift className='h-4 w-4 text-purple-500' />
            </div>
          </CardContent>
        </Card>

        <Card className='bg-card border border-purple-800/30'>
          <CardHeader className='pb-2'>
            <CardDescription>Total Gifts Redeemed</CardDescription>
            <CardTitle className='text-2xl font-bold'>
              {numberOfGiftsRedeemed}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-muted-foreground'>
                +8.2% from last month
              </div>
              <Activity className='h-4 w-4 text-purple-500' />
            </div>
          </CardContent>
        </Card>
        <Card className='bg-card border border-purple-800/30'>
          <CardHeader className='pb-2'>
            <CardDescription>Total Points Earned</CardDescription>
            <CardTitle className='text-2xl font-bold'>
              {numberofPoints}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-muted-foreground'>
                +20.1% from last month
              </div>
              <Award className='h-4 w-4 text-purple-500' />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue='activity' className='w-full'>
        <TabsList className='grid w-full grid-cols-2 md:w-[400px]'>
          <TabsTrigger value='activity'>Activity</TabsTrigger>
          <TabsTrigger value='value'>Value</TabsTrigger>
        </TabsList>
        <TabsContent value='activity' className='space-y-4'>
          <Card className='border border-purple-800/30'>
            <CardHeader>
              <CardTitle>Gift Card Activity</CardTitle>
              <CardDescription>
                Number of gift cards purchased and redeemed over time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='h-[300px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart
                    data={data}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' stroke='#333' />
                    <XAxis
                      dataKey='date'
                      stroke='#888'
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke='#888'
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className='rounded-lg border bg-background p-2 shadow-sm'>
                              <div className='grid grid-cols-2 gap-2'>
                                <div className='flex flex-col'>
                                  <span className='text-[0.70rem] uppercase text-muted-foreground'>
                                    {label}
                                  </span>
                                  <span className='font-bold text-muted-foreground'>
                                    Purchased
                                  </span>
                                </div>
                                <div className='flex flex-col'>
                                  <span className='flex items-center gap-1 text-[0.70rem] uppercase text-muted-foreground'>
                                    <div className='h-2 w-2 rounded-full bg-purple-500'></div>
                                    {payload[0].value}
                                  </span>
                                  <span className='flex items-center gap-1 text-[0.70rem] uppercase text-muted-foreground'>
                                    <div className='h-2 w-2 rounded-full bg-indigo-500'></div>
                                    {payload[1].value}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type='monotone'
                      dataKey='purchased'
                      stroke='#8b5cf6'
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type='monotone'
                      dataKey='redeemed'
                      stroke='#6366f1'
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='value' className='space-y-4'>
          <Card className='border border-purple-800/30'>
            <CardHeader>
              <CardTitle>Gift Card Value</CardTitle>
              <CardDescription>
                Total value of gift cards purchased and redeemed over time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='h-[300px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart
                    data={valueData}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' stroke='#333' />
                    <XAxis
                      dataKey='date'
                      stroke='#888'
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke='#888'
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className='rounded-lg border bg-background p-2 shadow-sm'>
                              <div className='grid grid-cols-2 gap-2'>
                                <div className='flex flex-col'>
                                  <span className='text-[0.70rem] uppercase text-muted-foreground'>
                                    {label}
                                  </span>
                                  <span className='font-bold text-muted-foreground'>
                                    Value
                                  </span>
                                </div>
                                <div className='flex flex-col'>
                                  <span className='flex items-center gap-1 text-[0.70rem] uppercase text-muted-foreground'>
                                    <div className='h-2 w-2 rounded-full bg-purple-500'></div>
                                    ${payload[0].value}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type='monotone'
                      dataKey='value'
                      stroke='#8b5cf6'
                      fill='#8b5cf6'
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
