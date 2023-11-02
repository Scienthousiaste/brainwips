defmodule BrainwipsWeb.MemoryLimitsController do
  use BrainwipsWeb, :controller

  def memory_limits(conn, _params) do
    render(conn, :memory_limits)
  end
end
