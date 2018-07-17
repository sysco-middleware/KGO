<template>
  <div class="panel">
    <div class="panel-header bg-primary text-white">
      <div class="columns flex-middle">
        <div class="column">
          <div class="panel-title h5 mt-10">Topic: reddit_posts</div>
          <div class="panel-subtitle"></div>
        </div>
      </div>
    </div>
    <Tabs nav="panel-nav" body="panel-body" name="topic" remember>
      <Tab name="Data" class="flush-padding">
        <Tabs nav="panel-nav" body="panel-body" name="topic-data" remember>
          <Tab name="Table">
            <table class="table table-striped table-scroll table-inline">
              <thead>
                <tr>
                  <th class="text-center">Partition</th>
                  <th class="text-center">Replica</th>
                  <th class="text-center">Replica broker</th>
                  <th>Is Leader</th>
                  <th>Is in-sync</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-center">0</td>
                  <td class="text-center">0</td>
                  <td class="text-center">0</td>
                  <td>true</td>
                  <td>true</td>
                </tr>
                <tr>
                  <td class="text-center">1</td>
                  <td class="text-center">0</td>
                  <td class="text-center">0</td>
                  <td>false</td>
                  <td>true</td>
                </tr>
              </tbody>
            </table>
          </Tab>
          <Tab name="RAW">
            <TopicEditor />
          </Tab>
        </Tabs>
      </Tab>
      <Tab name="Partitions (2)">
        <div class="card">
          <div class="card-header">
            <div class="tile-title"><b>Number of Partitions:</b> 5</div>
            <div class="tile-title"><b>Replication Factor:</b> 1</div>
          </div>
        </div>

        <table class="table table-striped table-scroll table-inline">
          <thead>
            <tr>
              <th class="text-center">Partition</th>
              <th class="text-center">Replica</th>
              <th class="text-center">Replica broker</th>
              <th>Is Leader</th>
              <th>Is in-sync</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-center">0</td>
              <td class="text-center">0</td>
              <td class="text-center">0</td>
              <td>true</td>
              <td>true</td>
            </tr>
            <tr>
              <td class="text-center">1</td>
              <td class="text-center">0</td>
              <td class="text-center">0</td>
              <td>false</td>
              <td>true</td>
            </tr>
          </tbody>
        </table>
      </Tab>
      <Tab name="Config">
      </Tab>
    </Tabs>
  </div>
</template>

<script>
import Tab from '@/components/Tab.vue'
import Tabs from '@/components/Tabs.vue'
import TopicEditor from '@/components/TopicEditor.vue'

export default {
  components: {
    Tab,
    Tabs,
    TopicEditor
  }
}
</script>
