defmodule Brainwips.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      BrainwipsWeb.Telemetry,
      Brainwips.Repo,
      {DNSCluster, query: Application.get_env(:brainwips, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: Brainwips.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: Brainwips.Finch},
      # Start a worker by calling: Brainwips.Worker.start_link(arg)
      # {Brainwips.Worker, arg},
      # Start to serve requests, typically the last entry
      BrainwipsWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Brainwips.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    BrainwipsWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
