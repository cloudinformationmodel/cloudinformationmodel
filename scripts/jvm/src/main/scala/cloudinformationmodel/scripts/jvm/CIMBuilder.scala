package cloudinformationmodel.scripts.jvm

import java.io.File
import java.nio.file.{Files, Paths}
import java.util.Comparator

import scala.collection.JavaConverters._

object CIMBuilder {

  val directory = "../../src"
  val distributionDirectory = "../../dist"
  val context = "../../src/context.jsonld"

  def main(args: Array[String]): Unit = {
    clean()
    cim2aml()
    aml2dt()
    aml2sql()
  }

  protected def cim2aml(): Unit = {
    println("CIM 2 AML running at " + Paths.get(directory).toAbsolutePath)
    aml.cim.RepositoryLoader.main(Array(directory, context))
    println("Moving to distribution concepts.yaml and schema.yaml")
    mv(directory + "/concepts.yaml", distributionDirectory +  "/concepts.yaml")
    mv(directory + "/schema.yaml", distributionDirectory +  "/schema.yaml")
  }

  protected def aml2dt(): Unit = {
    println("AML 2 DT running at " + Paths.get(directory).toAbsolutePath)
    aml.dt.RepositoryLoader.main(Array(directory))
    println("Moving to distribution schema.raml and schema.json")
    mv(directory + "/schema.raml", distributionDirectory +  "/schema.raml")
    mv(directory + "/schema.json", distributionDirectory +  "/schema.json")
  }

  protected def aml2sql(): Unit = {
    println("AML 2 SQL running at " + Paths.get(directory).toAbsolutePath)
    aml.sql.RepositoryLoader.main(Array(directory))
    println("Moving to distribution schema.sql and schema.r2rml")
    mv(directory + "/schema.sql", distributionDirectory +  "/schema.sql")
    mv(directory + "/schema.r2rml", distributionDirectory +  "/schema.r2rml")
  }

  protected def mv(source: String, target: String): Unit = {
    val s = new File(source)
    val t = new File(target)
    s.renameTo(t)
  }

  protected def clean(): Unit = {
    println("Cleaning " + Paths.get(directory).toAbsolutePath)
    var files = Files.walk(Paths.get(directory))
      .sorted(Comparator.reverseOrder())
      .iterator().asScala

    files
      .filter(f => f.endsWith(".jsonld"))
      .foreach(f => {
        println(f)
        f.toFile.delete()
      })

    println("Cleaning distribution " + Paths.get(distributionDirectory).toAbsolutePath)
    files = Files.walk(Paths.get(distributionDirectory))
      .sorted(Comparator.reverseOrder())
      .iterator().asScala

    files
      .filter(f => f.toFile.isDirectory)
      .foreach(f => {
        println(f)
        f.toFile.delete()
      })
  }
}
