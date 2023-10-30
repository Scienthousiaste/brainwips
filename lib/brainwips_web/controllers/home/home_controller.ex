defmodule BrainwipsWeb.HomeController do
  use BrainwipsWeb, :controller

  def home(conn, _params) do
    render(conn, :home, layout: false)
  end
end
