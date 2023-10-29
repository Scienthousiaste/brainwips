defmodule Brainwips.Repo do
  use Ecto.Repo,
    otp_app: :brainwips,
    adapter: Ecto.Adapters.Postgres
end
