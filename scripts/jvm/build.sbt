name := "cim-build"

version := "0.1.0"

scalaVersion := "2.12.10"

resolvers +=
  "MuleSoft releases" at "https://repository-master.mulesoft.org/nexus/content/repositories/releases"
resolvers +=
  "Github Packages cim2aml" at "https://maven.pkg.github.com/aml-org/cim2aml"
resolvers +=
  "Github Packages aml2dt" at "https://maven.pkg.github.com/aml-org/aml2dt"
resolvers +=
  "Github Packages aml2sql" at "https://maven.pkg.github.com/aml-org/amlsql"

publishTo := Some("GitHub Package Registry" at "https://maven.pkg.github.com/aml-org/cim2aml")
credentials += Credentials("GitHub Package Registry","maven.pkg.github.com",
  sys.env.getOrElse("GITHUB_USER", ""),
  sys.env.getOrElse("GITHUB_TOKEN", "")
)


mainClass in (Compile, run) := Some("cloudinformationmodel.scripts.jvm.CIMBuilder")

libraryDependencies += "org.slf4j" % "slf4j-api" % "1.7.25"
libraryDependencies += "com.github.amlorg" %% "amf-client" % "3.5.4"
libraryDependencies += "com.github.amlorg" %% "cim2aml" % "0.1.1"
libraryDependencies += "com.github.amlorg" %% "aml2dt" % "0.1.1"
libraryDependencies += "com.github.amlorg" %% "aml2sql" % "0.1.0"
