"use client"

import { Users, Calendar, ClipboardList, FolderOpen, Plus, ChevronRight } from "lucide-react"

export function PTOCommandView() {
  return (
    <div className="bg-[#0B1B3A] border border-border rounded-2xl overflow-hidden shadow-lg">
      {/* Top Bar */}
      <div className="bg-[#122E57] border-b border-[#1A365D] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="font-serif text-sm text-primary">FH</span>
          </div>
          <span className="font-medium text-white">Forest Hills PTO</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#0B1B3A] rounded-lg border border-[#1A365D] overflow-hidden text-xs">
            <button className="px-3 py-1.5 text-[#9FB3C8] hover:bg-[#1A365D] transition-colors">Draft</button>
            <button className="px-3 py-1.5 bg-primary text-white">Published</button>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-3.5 h-3.5" />
            Add Event
          </button>
        </div>
      </div>

      <div className="flex min-h-[420px]">
        {/* Left Sidebar - Darker */}
        <div className="w-44 bg-[#081428] border-r border-[#1A365D] p-3 flex-shrink-0">
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#9FB3C8] hover:bg-[#0F2747] rounded-lg transition-colors">
              <FolderOpen className="w-4 h-4" />
              Committees
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-primary/20 text-primary rounded-lg font-medium">
              <Calendar className="w-4 h-4" />
              Events
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#9FB3C8] hover:bg-[#0F2747] rounded-lg transition-colors">
              <ClipboardList className="w-4 h-4" />
              Opportunities
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#9FB3C8] hover:bg-[#0F2747] rounded-lg transition-colors">
              <Users className="w-4 h-4" />
              Volunteers
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Left Panel - Committees & Events */}
          <div className="w-56 border-r border-[#1A365D] p-4 flex-shrink-0 bg-[#0B1B3A]">
            <h3 className="text-xs font-medium text-[#9FB3C8] uppercase tracking-wide mb-3">Committees</h3>
            <div className="space-y-3">
              {/* Committee 1 */}
              <div className="bg-[#122E57] rounded-lg p-3 border border-[#1A365D]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">Events Committee</span>
                </div>
                <p className="text-xs text-[#9FB3C8] mb-2">Chair: Maria S.</p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1 text-primary cursor-pointer hover:underline">
                    <ChevronRight className="w-3 h-3" />
                    Spring Carnival
                  </div>
                  <div className="flex items-center gap-1 text-[#9FB3C8] cursor-pointer hover:text-white">
                    <ChevronRight className="w-3 h-3" />
                    Movie Night
                  </div>
                </div>
              </div>

              {/* Committee 2 */}
              <div className="bg-[#122E57] rounded-lg p-3 border border-[#1A365D]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">Fundraising</span>
                </div>
                <p className="text-xs text-[#9FB3C8] mb-2">Chair: David L.</p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1 text-[#9FB3C8] cursor-pointer hover:text-white">
                    <ChevronRight className="w-3 h-3" />
                    Book Fair
                  </div>
                </div>
              </div>

              {/* Committee 3 */}
              <div className="bg-[#122E57] rounded-lg p-3 border border-[#1A365D]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">Hospitality</span>
                </div>
                <p className="text-xs text-[#9FB3C8] mb-2">Chair: Jennifer K.</p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1 text-[#9FB3C8] cursor-pointer hover:text-white">
                    <ChevronRight className="w-3 h-3" />
                    Teacher Appreciation
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Panel - Selected Event */}
          <div className="flex-1 p-4 bg-[#0F2747]">
            <div className="bg-[#1A365D] rounded-xl border border-[#234876] p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg text-white">Spring Carnival</h2>
                <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">Draft</span>
              </div>
              
              <div className="flex gap-4 text-xs text-[#9FB3C8] mb-5">
                <span>One-time event</span>
                <span>Saturday, April 12</span>
              </div>

              <h3 className="text-sm font-medium text-white mb-3">Suggested Opportunities</h3>
              <div className="space-y-2">
                {/* Task 1 */}
                <div className="bg-[#234876] rounded-lg p-3 border border-[#2D5A8C]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">Setup Crew</span>
                    <span className="text-xs text-[#9FB3C8]">30 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-1">
                      <div className="w-5 h-5 rounded-full bg-primary/20 border-2 border-[#1A365D] flex items-center justify-center text-[10px] text-primary">J</div>
                      <div className="w-5 h-5 rounded-full bg-primary/20 border-2 border-[#1A365D] flex items-center justify-center text-[10px] text-primary">M</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#1A365D] rounded-full overflow-hidden">
                        <div className="w-1/3 h-full bg-primary rounded-full" />
                      </div>
                      <span className="text-xs text-[#9FB3C8]">2/6</span>
                    </div>
                  </div>
                </div>

                {/* Task 2 */}
                <div className="bg-[#234876] rounded-lg p-3 border border-[#2D5A8C]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">Ticket Table</span>
                    <span className="text-xs text-[#9FB3C8]">1 hr shifts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-1">
                      <div className="w-5 h-5 rounded-full bg-primary/20 border-2 border-[#1A365D] flex items-center justify-center text-[10px] text-primary">S</div>
                      <div className="w-5 h-5 rounded-full bg-primary/20 border-2 border-[#1A365D] flex items-center justify-center text-[10px] text-primary">A</div>
                      <div className="w-5 h-5 rounded-full bg-primary/20 border-2 border-[#1A365D] flex items-center justify-center text-[10px] text-primary">R</div>
                      <div className="w-5 h-5 rounded-full bg-[#1A365D] border-2 border-[#1A365D] flex items-center justify-center text-[10px] text-[#9FB3C8]">+2</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#1A365D] rounded-full overflow-hidden">
                        <div className="w-[62%] h-full bg-primary rounded-full" />
                      </div>
                      <span className="text-xs text-[#9FB3C8]">5/8</span>
                    </div>
                  </div>
                </div>

                {/* Task 3 */}
                <div className="bg-[#234876] rounded-lg p-3 border border-[#2D5A8C]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">Cleanup Crew</span>
                    <span className="text-xs text-[#9FB3C8]">30 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-1">
                      <div className="w-5 h-5 rounded-full bg-primary/20 border-2 border-[#1A365D] flex items-center justify-center text-[10px] text-primary">K</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#1A365D] rounded-full overflow-hidden">
                        <div className="w-1/4 h-full bg-amber-500 rounded-full" />
                      </div>
                      <span className="text-xs text-amber-400">1/4</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Volunteers & Gaps */}
          <div className="w-52 border-l border-[#1A365D] p-4 flex-shrink-0 bg-[#0B1B3A]">
            <h3 className="text-xs font-medium text-[#9FB3C8] uppercase tracking-wide mb-3">Interested Parents</h3>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 p-2 bg-[#1A365D] rounded-lg border border-[#234876]">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary">J</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">Jessica T.</p>
                  <p className="text-[10px] text-[#9FB3C8] truncate">Evenings, setup</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-[#1A365D] rounded-lg border border-[#234876]">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary">M</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">Michael R.</p>
                  <p className="text-[10px] text-[#9FB3C8] truncate">Weekends, outdoors</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-[#1A365D] rounded-lg border border-[#234876]">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary">A</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">Amanda K.</p>
                  <p className="text-[10px] text-[#9FB3C8] truncate">From home, crafts</p>
                </div>
              </div>
            </div>

            <h3 className="text-xs font-medium text-[#9FB3C8] uppercase tracking-wide mb-3">Gaps to Fill</h3>
            <div className="space-y-2">
              <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs font-medium text-amber-800">Setup Crew</p>
                <p className="text-[10px] text-amber-600">Needs 4 more</p>
              </div>
              <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs font-medium text-amber-800">Ticket Table</p>
                <p className="text-[10px] text-amber-600">Needs 3 more</p>
              </div>
              <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs font-medium text-red-800">Cleanup Crew</p>
                <p className="text-[10px] text-red-600">Needs 3 more</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
